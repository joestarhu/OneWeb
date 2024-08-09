
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/account', component: () => import('pages/AccountList.vue') },
      { path: '/org', component: () => import('pages/OrgList.vue') },
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
