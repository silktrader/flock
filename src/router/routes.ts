import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/HomePage.vue')
    }, {
      path: 'ride-search',
      component: () => import('pages/RideSearchPage.vue')
    },
    {
      path: 'search-results',
      component: () => import('pages/RideSearchResultsPage.vue')
    },
    {
      path: 'ride-details',
      component: () => import('pages/RideDetailsPage.vue')
    },
    {
      path: 'request-sent',
      component: () => import('pages/RequestSentPage.vue')
    },
    {
      path: '/profile',
      component: () => import('pages/ProfilePage.vue')
    },
    {
      path: '/create-ride',
      component: () => import('pages/CreateRide.vue')
    },
    {
      path: 'search',
      component: () => import('pages/SearchingPage.vue')
    },
    {
      path: 'date-select',
      component: () => import('pages/DateSelection.vue')
    },
    {
      path: 'filters',
      component: () => import('pages/SearchFilters.vue')
    },
    {
      path: 'sap-location-select/:target',
      component: () => import('pages/SapLocationSelection.vue'),
      props: true
    },
    {
      path: 'location-select/:target',
      component: () => import('pages/LocationSelection.vue'),
      props: true
    },
    {
      path: 'pending-ride-requests',
      component: () => import('pages/PendingRequests.vue')
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
