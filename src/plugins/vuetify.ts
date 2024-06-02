import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import { es } from "vuetify/locale"

export default createVuetify({
  locale: {
    locale: "es",
    fallback: "es",
    messages: { es },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      dark: {
        dark: false,
        colors: {
          primary: "#EEA04F",
          accent: "#3D3D3D",
          secondary: "#ffe18d",
          success: "#4CAF50",
          info: "#2196F3",
          warning: "#fbc02d",
          error: "#FF5252",
          "on-primary": "#FFFFFF",
        },
      },
      light: {
        dark: false,
        colors: {
          primary: "#EEA04F",
          accent: "#3D3D3D",
          secondary: "#ffe18d",
          success: "#4CAF50",
          info: "#2196F3",
          warning: "#fbc02d",
          error: "#FF5252",
          "on-primary": "#FFFFFF",
        },
      },
    },
  },
})
