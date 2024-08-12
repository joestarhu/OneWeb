
const routes = [
  {
    path: '/one',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OneManager/IndexPage.vue') },
      { path: '/one/account', component: () => import('src/pages/OneManager/AccountList.vue') },
      { path: '/one/org', component: () => import('src/pages/OneManager/OrgList.vue') },
      { path: '/one/role', component: () => import('src/pages/OneManager/RoleList.vue') },
      { path: '/one/app', component: () => import('src/pages/OneManager/AppList.vue') },
    ]
  },
  {
    path: "/login", component: () => import("layouts/LoginLayout.vue")
  },
  {
    path: "/applist", component: () => import("layouts/AppLayout.vue")
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
