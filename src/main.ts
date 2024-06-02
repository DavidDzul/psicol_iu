import { ApolloClient, InMemoryCache } from "@apollo/client/core"
import { provideApolloClient } from "@vue/apollo-composable"
import { createUploadLink } from "apollo-upload-client"
import { extend, locale } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { createApp } from "vue"

import { registerPlugins } from "@/plugins"

import App from "./App.vue"

const app = createApp(App)

extend(relativeTime) // use locale
locale("es-mx") // use locale

const httpLink = createUploadLink({
  uri: import.meta.env.VITE_API_URL,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})
provideApolloClient(apolloClient)

registerPlugins(app)

app.mount("#app")
