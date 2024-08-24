import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { ROUTES } from '@/util/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES.LANDING,
      name: 'Landing',
      component: () => import('@/views/LandingView.vue'),
      meta: {
        requiresAuth: false,
        showNav: false,
        showHeader: false
      }
    },
    {
      path: ROUTES.REGISTER,
      name: 'Register',
      component: () => import('@/views/SignupView.vue'),
      meta: {
        requiresAuth: false,
        showNav: false,
        showHeader: false
      }
    },
    {
      path: ROUTES.LOGIN,
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        requiresAuth: false,
        showNav: false,
        showHeader: false
      }
    },
    {
      path: ROUTES.HOME,
      name: 'Home',
      component: HomeView,
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: `${ROUTES.BLOG}/:slug`,
      name: 'BlogPost',
      component: () => import('@/views/BlogPostView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: `${ROUTES.EDIT_POST}/:slug`,
      name: 'EditPost',
      component: () => import('@/views/EditPostView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: ROUTES.POST,
      name: 'Post',
      component: () => import('@/views/NewPostView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: ROUTES.MYPOSTS,
      name: 'MyPosts',
      component: () => import('@/views/MyPostsView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: ROUTES.SEARCH_RESULTS,
      name: 'SearchResults',
      component: () => import('@/views/SearchResultsView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    },
    {
      path: ROUTES.COMMENTS,
      name: 'Comments',
      component: () => import('@/views/MyCommentsView.vue'),
      meta: {
        requiresAuth: true,
        showNav: true,
        showHeader: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    localStorage.setItem('lastRoute', to.path)
    next({ name: 'Login' })
  } else if (!to.meta.requiresAuth && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
