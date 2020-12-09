---
title: '一次多主题任务需求的总结'
date: 2020-12-01
categories:
  - 前端
tags:
  - vue
  - webpack
  - vue-element-admin
---

最近项目有个需求，要对后台的管理项目额外添加一个入口给另一类用户使用，而里面的内容还是一样的，还是用的以前的权限系统，但是蛋疼的是需要变换主题颜色。两种入口对应的域名是不一样的，也就是需要分开构建的。我想这还不简单么，配置一个打包环境就行啦，然后入口处直接根据环境分别去引入不同的样式文件就可以。项目用的element组件库，更换主题颜色也比较容易。

准备完样式文件后，我发现有点不对劲了，因为项目中有的地方用到了主题色，但是并不是element的组件，需要我单独引入sass变量才可以使用。有些自定义组件中也用到了sass的变量，也需要单独引入。为了代码可以优雅有些，我不想用if/else的方式去引入样式文件(万一下次又多了几种主题，这样就麻烦了)，然后我第一时间想到的是条件编译，之前写uniapp项目的时候就经常用到条件编译，我就在想是不是也有这样的一个webpack插件可以通过某种书写方式完成条件编译。

经过一番查找，一个叫 [js-conditional-compile-loader](https://github.com/hzsrc/js-conditional-compile-loader) 的loader引起了我的注意( 作者应该是国人，还有中文文档，好评:+1: )。看了一下文档，使用起来还是蛮简单的。

配置方式：
``` js
const conditionalCompiler = {
    loader: 'js-conditional-compile-loader',
    options: {
        isDebug: process.env.NODE_ENV === 'development', // optional, this expression is default
        envTest: process.env.ENV_CONFIG === 'test', // any prop name you want, used for /* IFTRUE_evnTest ...js code... FITRUE_evnTest */
        myFlag: process.env.npm_config_myflag, // enabled by `npm run build --myflag`
    }
}

module.exports = {
    // others...
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader', conditionalCompiler],
            },
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                use: [
                    //step-2
                    'babel-loader?cacheDirectory',
                    //step-1
                    conditionalCompiler,
                ],
            },
            // others...
        ]
    }
}
```
使用方式：
```js
<temeplate>
    <div>
        /* IFTRUE_myFlag
        <h2>This is a test! For HTML. vue模板内也可以使用！</h2>
        <pre>
            {{$attrs.info || ''}}
        </pre>
        FITRUE_myFlag */
    </div>
</temeplate>

<script>
    var vueComponent = {
        data: {
            /* IFTRUE_myFlag
            falgData: 'Flag Data',
            FITRUE_myFlag */
        },
    };
</script>

/* IFTRUE_myFlag*/
<style scoped>
    .any-where-test {
        color: red;
    }
</style>
/* FITRUE_myFlag*/


<style id="a" scoped>
    /* IFTRUE_myFlag*/
    .test-for-css {
        color: red;
    }
    /*FITRUE_myFlag */
</style>
```
需要注意这个注释的字符，开始是```IF```，结束是```FI```( 我被这个细节卡了好久:expressionless: )。文档上说同样支持样式文件使用，只需要将```js-conditional-compile-loader```放在样式loader的最后一个，让它优先执行就可以了( loader的执行优先级是从后向前 )。

准备工作做完以后，我开始准备看看效果了，后来...我等了6min项目才编译完，emmm...是不是有点不正常，于是我又配置了 loader 的 exclude ，但是结果还是一样，编译速度非常慢。又去 GitHub 的 issue 上看看有没有别人也反馈这个问题，结果也没有。一时间没了头绪，不知道从哪里排查。这个时间正好又有别的紧急任务排过来了，只能先搁置一下，但是我一直就有一个想法，是不是我优化一下 webpack 配置就可以提速了呢？项目在此之前编译时间也不断，差不多需要2min。

后来我在家自己搜索了一些相关的资料，有很多方式，比如用 dllPlugin，HappyPack，babel-loader设置cacheDirectory。在现有项目中 babel-loader 的优化已经存在了，于是我就想从 DllPlugin 起手。先看文档吧，查文档的时候我找了另一篇文章，讨论是否真的需要 DllPlugin，我当时就感觉这里一定有东西，于是进去看了，结论就是一般情况下都不需要，连 vue-cli 都移除了相关的配置， 尤大回复这个改动的时候说 webpack4 本身就有很高的性能了，所以并不需要这个插件来优化。但是另一个插件又出现在我眼前，它就是[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)。这个插件还被 webpack5 设置为默认配置，可见这款插件有多厉害啦。

```hard-source-webpack-plugin```这个插件的使用方式也是非常简单
```js
// webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  context: // ...
  entry: // ...
  output: // ...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```
配置好以后我就尝试编译，第一次还是2min，这个插件是基于缓存来进行加速的，所以我又尝试了第二次，结果非常明显，才用了15s。

在查阅资料的过程中看到了一些其他可以完成多主题任务的方案，其中就有一个非常有意思的想法。利用webpack的alias指定不同环境中不同的主题文件名。之前想到利用条件编译是因为css类型的文件没办法读取node的环境变量，但是在webpack配置文件中是可以读取的，这样就完美的避开了之前尴尬的问题。