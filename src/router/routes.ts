import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: '首页',
    meta: {
      // view: 'blank',
      renderMenu: true,
    },
    component: () => import('@/pages/home'),
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
  // {
  //   path: '/demo',
  //   name: '示范页面',
  //   meta: {
  //     icon: 'BarsOutlined',
  //     // target: '_blank',
  //     cacheable: true,
  //     renderMenu: true,
  //   },
  //   component: () => import('@/pages/demo/index'),
  //   // children: [
  //   //   {
  //   //     path: '/demo1',
  //   //     name: '示范页面1',
  //   //     meta: {
  //   //       icon: 'BarsOutlined',
  //   //       // view: 'blank',
  //   //       target: '_self',
  //   //       cacheable: false,
  //   //       renderMenu: true,
  //   //     },
  //   //     component: () => import('@/pages/demo1/index'),
  //   //   },
  //   // ],
  // },
  {
    path: '/fxrealtime',
    name: '外汇头寸（实时）',
    meta: {
      icon: 'BarsOutlined',
      // target: '_blank',
      cacheable: true,
      renderMenu: true,
    },
    component: () => import('@/pages/fxrealtime/index'),
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
    path: '/system',
    name: '系统配置',
    meta: {
      icon: 'SettingOutlined',
      renderMenu: true,
    },
    component: () => import('@/components/layout/BlankView.vue'),
    children: [
      {
        path: '/menu',
        name: '菜单管理',
        meta: {
          icon: 'MenuOutlined',
          cacheable: true,
        },
        component: () => import('@/pages/system/menu'),
      },
      {
        path: '/role',
        name: '角色管理',
        meta: {
          icon: 'SolutionOutlined',
          cacheable: true,
        },
        component: () => import('@/pages/system/role'),
      },
      {
        path: '/user',
        name: '用户管理',
        meta: {
          icon: 'TeamOutlined',
          cacheable: true,
        },
        component: () => import('@/pages/system/user'),
      },
    ],
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
