import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: '示范页面',
    meta: {
      icon: 'BarsOutlined',
      // target: '_blank',
      cacheable: true,
      renderMenu: true,
    },
    component: () => import('@/pages/demo/index'),
    // children: [
    //   {
    //     path: '/demo1',
    //     name: '示范页面1',
    //     meta: {
    //       icon: 'BarsOutlined',
    //       // view: 'blank',
    //       target: '_self',
    //       cacheable: false,
    //       renderMenu: true,
    //     },
    //     component: () => import('@/pages/demo1/index'),
    //   },
    // ],
  },
  {
    path: '/demo1',
    name: '示范页面1',
    meta: {
      icon: 'BarsOutlined',
      // target: '_blank',
      cacheable: true,
      renderMenu: true,
    },
    component: () => import('@/pages/demo1/index'),
  },
  {
    path: '/login',
    name: '登录',
    meta: {
      icon: 'LoginOutlined',
      view: 'blank',
      target: '_blank',
      cacheable: false,
      renderMenu: false,
    },
    component: () => import('@/pages/login'),
  },
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
  },
  {
    path: '/home',
    name: '首页',
    meta: {
      view: 'blank',
      renderMenu: false,
    },
    component: () => import('@/pages/home'),
  },
  {
    path: '/front',
    name: '前端',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '/login',
        name: '登录',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/login'),
      },
      // {
      //   path: '/home',
      //   name: '首页',
      //   meta: {
      //     view: 'blank',
      //   },
      //   component: () => import('@/pages/home'),
      // },
    ],
  },
  {
    path: '/403',
    name: '403',
    props: true,
    meta: {
      renderMenu: false,
    },
    component: () => import('@/pages/Exp403.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    props: true,
    meta: {
      icon: 'CreditCardOutlined',
      renderMenu: false,
      cacheable: false,
      _is404Page: true,
    },
    component: () => import('@/pages/Exp404.vue'),
  },
];

export default routes;
