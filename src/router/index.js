import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const HeroesList = () => import('@/views/HeroesList.vue')
const HeroDetail = () => import('@/views/HeroesList.vue')
const EventsList = () => import('@/views/EventsList.vue')
const EventDetail = () => import('@/views/EventsDetail.vue')
const ThemesList = () => import('@/views/ThemesList.vue')
const ThemeDetail = () => import('@/views/ThemeDetail.vue')
const TimelineView = () => import('@/views/TimelineView.vue')
const MapView = () => import('@/views/MapView.vue')
const TextView = () => import('@/views/TextFragmentPage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/heroes', component: HeroesList },
    { path: '/heroes/:id', component: HeroDetail, props: true },
    { path: '/events', component: EventsList },
    { path: '/events/:id', component: EventDetail, props: true },
    { path: '/themes', component: ThemesList },
    { path: '/themes/:id', component: ThemeDetail, props: true },
    { path: '/timeline', component: TimelineView },
    { path: '/map', component: MapView },
    // В вашем router/index.js добавьте:
    {
    path: '/text/:id',name: 'text-fragment', component: TextView, props: true
    }
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router