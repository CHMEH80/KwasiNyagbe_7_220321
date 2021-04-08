// Tableau contenant les objets qui définissent chaque route
// de l'application Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
 {
  // l'url correspondant au composant 
  path: '/',
  // le nom de cette route pour l'étiquetage et le débbuggage
  name: 'Wall',
  // composant qui doit s'afficher lorsque le path est trouvé
  component: () => import('../views/Wall.vue')
},
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
