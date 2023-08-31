import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/HomePage.vue')
    },
    {
      path: '/rides/search',
      component: () => import('pages/RideSearchResultsPage.vue')
    },
    {
      path: '/rides/search/filters',
      component: () => import('pages/SearchFilters.vue')
    },
    {
      path: '/rides/search/sap-location-select/:target',
      component: () => import('pages/SapLocationSelection.vue'),
      props: true
    },
    {
      path: '/rides/search/location-select/:target',
      component: () => import('pages/LocationSelection.vue'),
      props: true
    },
    {
      path: '/rides/search/date-select',
      component: () => import('pages/DateSelection.vue')
    },
    {
      path: '/rides/requests',
      component: () => import('pages/PendingRequests.vue')
    },
    {
      path: '/rides/details', // tk change
      component: () => import('pages/RideDetailsPage.vue')
    },
    {
      path: '/rides/details-alt', // tk change
      component: () => import('pages/RideDetailsAlt.vue')
    },
    {
      path: '/rides/search/request-sent',
      component: () => import('pages/RequestSentPage.vue')
    },
    {
      path: '/profile',
      component: () => import('pages/ProfilePage.vue')
    },
    {
      path: '/create-ride',
      component: () => import('pages/CreateRide.vue')
    }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
