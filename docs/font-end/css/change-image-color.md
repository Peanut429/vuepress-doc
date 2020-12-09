---
title: '用css修改图片颜色'
date: 2020-12-09
categories:
  - 前端
tags:
  - css
---

公司开发的小程序为了高度自定义，tabbar采用了自定义的组件，然后在需要的地方直接引用。tabbar内的图标都是可更换的，每个图标对应的页面路径也是完全可以自定义配置。一开始图标为了可以切换颜色，tabbar的图标就采用了iconfont的方案(小程序可以切换主题颜色)，但是后来需求越来越多了，用iconfont已经不太方便了，必须找到一个可以更灵活一点的方式，最好可以随意变换图标的颜色，这样让用户上传自己喜欢的图片就可以了，不用再麻烦的做图标再上传到iconfont上。

去网上翻阅资料后找到了一个方案，就是利用css的background-blend-mode实现图片颜色任意切换，这个属性是将背景图进行混合，混合后会变成新的颜色。资料中的方案是设置两层背景，第一个层是图片，要求白底，图案黑色，然后第二层是纯色，再将background-blend-mode设置为lighten，意思是变亮。然后看到的结果就是图片中黑色的部分变成第二层设置的颜色，下面展示一个案例

原图：

<img src="https://user-images.githubusercontent.com/8554143/34239266-232bdfc0-e641-11e7-8792-408782aaa78e.png" style="width: 100px;height: 100px;">

修改后：

<div style="width: 100px;height:100px;background-image: url(https://user-images.githubusercontent.com/8554143/34239266-232bdfc0-e641-11e7-8792-408782aaa78e.png), linear-gradient(deeppink, deeppink);background-blend-mode:lighten;background-size: cover;"></div>

代码如下：

``` html
<style>
.image {
  width: 100px;
  height:100px;
  background-image: url(https://user-images.githubusercontent.com/8554143/34239266-232bdfc0-e641-11e7-8792-408782aaa78e.png), linear-gradient(deeppink, deeppink);background-blend-mode:lighten;
  background-size: cover;
}
</style>
<div class="image"></div>
```

background-blend-mode其实还有很多值：
``` css
background-blend-mode: normal;          /* 正常 */
background-blend-mode: multiply;        /* 正片叠底 */
background-blend-mode: screen;          /* 滤色 */
background-blend-mode: overlay;         /* 叠加 */
background-blend-mode: darken;          /* 变暗 */
background-blend-mode: lighten;         /* 变亮 */
background-blend-mode: color-dodge;     /* 颜色减淡 */
background-blend-mode: color-burn;      /* 颜色加深 */
background-blend-mode: hard-light;      /* 强光 */
background-blend-mode: soft-light;      /* 柔光 */
background-blend-mode: difference;      /* 差值 */
background-blend-mode: exclusion;       /* 排除 */
background-blend-mode: hue;             /* 色相 */
background-blend-mode: saturation;      /* 饱和度 */
background-blend-mode: color;           /* 颜色 */
background-blend-mode: luminosity;      /* 亮度 */
```

在看张鑫旭的文章中还发现了另一种修改图片颜色的方式，使用css的mask( 缺点是兼容性不是太理想，暂时只支持webkit前缀 )。要求是图片为png类型，图标的颜色可以任意，图标的其他区域为透明色。
下面是我从iconfont上下载的一个图标，因为原图是白色图案这里就直接展示结果了：
<div style="width: 100px;height: 100px;background-color: red;-webkit-mask-image: url(/blog/example.png);mask-size: cover;"></div>
代码如下：

``` html
<style>
.image {
  width: 100px;
  height: 100px;
  background-color: red;
  -webkit-mask-image: url(/blog/example.png);
  mask-size: cover;
}
</style>
<div class="image"></div>
```