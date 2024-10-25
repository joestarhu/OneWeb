
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/account', component: () => import('src/pages/AccountManager.vue') },
      // { path: '/account', component: () => import('src/pages/AccountList.vue') },
      { path: '/org', component: () => import('src/pages/OrgManager.vue') },
      { path: '/role', component: () => import('src/pages/RoleManager.vue') },
      { path: '/app', component: () => import('src/pages/AppContainer.vue') },
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
