export default {
  singular: true,
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      locale: {
        enable: true,
      },
    }],
  ],
  routes: [
    {
      path: '/',
      component: '../layout',
      routes: [
        {
          path: '/',
          component: './index'
        },
        {
          path: 'dashboard',
          routes: [
            { path: 'analysis', component: './dashboard/analysis' }
          ]
        },
        {
          path: 'helloworld',
          component: './HelloWorld'
        },
        { path: 'cards', component: './cards' },
        { path: 'puzzlecards', component: './puzzlecards' },
        { path: 'list', component: './list' },
        { path: 'typescript', component: './tsdemo' },
        { path: 'locale', component: './locale' },
        { path: 'tree', component: './tree' }
      ]
    }
  ],
  proxy: {
    '/ele': {
      target: 'http://localhost:8083',
      changeOrigin: true,
    },
  },
};
