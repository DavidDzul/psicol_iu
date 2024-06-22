import { storeToRefs } from "pinia"
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import { useAuthStore } from "@/store/api/authStore"

const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "AuthLayout",
    component: () => import("@/layouts/AuthLayout.vue"),
    redirect: "auth/login",
    beforeEnter: async (to, from, next) => {
      const { getProfile } = useAuthStore()
      const { loggedUser } = storeToRefs(useAuthStore())
      const token = localStorage.getItem("token")
      if (!token) {
        return next()
      } else if (loggedUser.value?.id) {
        await router.push("/")
      } else {
        await getProfile(token, to)
      }
      return next()
    },
    children: [{ path: "login", name: "Login", component: () => import("@/views/auth/LoginView.vue") }],
  },
  {
    path: "/",
    beforeEnter: async (to, from, next) => {
      const { getProfile } = useAuthStore()
      const { loggedUser } = storeToRefs(useAuthStore())
      const token = localStorage.getItem("token")
      if (!token) {
        await router.push("/auth/login")
      } else if (loggedUser.value?.id) {
        return next()
      } else {
        await getProfile(token, to)
      }
      return next()
    },
    component: () => import("@/layouts/Layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        components: { default: () => import("@/views/Home.vue") },
      },
      {
        path: "becarios",
        name: "Students",
        components: { default: () => import("@/views/users/StudentsView.vue") },
      },
      {
        path: "usuarios/:id",
        name: "StudentDetails",
        components: { default: () => import("@/views/users/StudentDetails.vue") },
      },
      {
        path: "configuraciones",
        name: "Settings",
        components: { default: () => import("@/views/settings/SettingsView.vue") },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
