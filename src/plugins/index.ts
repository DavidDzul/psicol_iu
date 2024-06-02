import type { App } from "vue"

import vPhoneInput from "./v-phone-input"
import veevalidate from "./vee-validate"
import vuetify from "./vuetify"
import router from "../router"
import pinia from "../store"

export function registerPlugins(app: App) {
  app.use(vuetify).use(pinia).use(router).use(vPhoneInput)
  veevalidate()
}
