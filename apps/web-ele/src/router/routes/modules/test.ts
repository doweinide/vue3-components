import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:activity',
      keepAlive: true,
      title: '测试模块',
    },
    name: 'TestModule',
    path: '/test',
    children: [
      {
        meta: {
          title: 'SSE测试',
        },
        name: 'Test1',
        path: '/test/test1',
        component: () => import('#/views/test/test1/index.vue'),
      },
      {
        meta: {
          title: '邮箱发送测试',
        },
        name: 'Test2',
        path: '/test/test2',
        component: () => import('#/views/test/test2/index.vue'),
      },
      {
        meta: {
          title: 'webSocket测试',
        },
        name: 'Test3',
        path: '/test/test3',
        component: () => import('#/views/test/test3/index.vue'),
      },
      {
        meta: {
          title: '普通文件上传测试',
        },
        name: 'Test4',
        path: '/test/test4',
        component: () => import('#/views/test/test4/index.vue'),
      },
      {
        meta: {
          title: '大文件断点上传测试',
        },
        name: 'Test5',
        path: '/test/test5',
        component: () => import('#/views/test/test5/index.vue'),
      },
      {
        meta: {
          title: '测试组件6',
        },
        name: 'Test6',
        path: '/test/test6',
        component: () => import('#/views/test/test6/index.vue'),
      },
      {
        meta: {
          title: '测试组件7',
        },
        name: 'Test7',
        path: '/test/test7',
        component: () => import('#/views/test/test7/index.vue'),
      },
      {
        meta: {
          title: '测试组件8',
        },
        name: 'Test8',
        path: '/test/test8',
        component: () => import('#/views/test/test8/index.vue'),
      },
      {
        meta: {
          title: '测试组件9',
        },
        name: 'Test9',
        path: '/test/test9',
        component: () => import('#/views/test/test9/index.vue'),
      },
      {
        meta: {
          title: '测试组件10',
        },
        name: 'Test10',
        path: '/test/test10',
        component: () => import('#/views/test/test10/index.vue'),
      },
    ],
  },
];

export default routes;
