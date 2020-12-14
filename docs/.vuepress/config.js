module.exports = {
  theme: 'reco',
  title: '',
  description: 'my blog',
  base: '/',
  head: [
    ['meta', {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=no'
    }],
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    type: 'blog',
    author: 'Peanut',
    authorAvatar: '/logo.png',
    sidebar: {
      '/123/': [
        {
          title: '测试',
          collapsable: true,
          children: [
            'test',
            'test1'
          ]
        }
      ]
    },
    subSidebar: 'auto',
    nav: [
      { text: '主页', link: '/', icon: 'reco-home' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
    ],
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: '标签'      // 默认文案 “标签”
      }
    },
    friendLink: [
      // {
      //   title: 'vuepress-theme-reco',
      //   desc: 'A simple and beautiful vuepress Blog & Doc theme.',
      //   logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   link: 'https://vuepress-theme-reco.recoluan.com'
      // },
      // {
      //   title: '午后南杂',
      //   desc: 'Enjoy when you can, and endure when you must.',
      //   email: 'recoluan@qq.com',
      //   link: 'https://www.recoluan.com'
      // }
    ]
  }
}