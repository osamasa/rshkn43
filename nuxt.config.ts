import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'
import 'dotenv/config'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      liffId: process.env.LIFF_ID
    },
  },
  devtools: { enabled: true },
  build: {
      transpile: ['vuetify'],
  },
  hooks: {
      'vite:extendConfig': (config) => {
          config.plugins!.push(vuetify())
      },
  },
  vite: {
     ssr: {
          noExternal: ['vuetify'],
     },
     define: {
         'process.env.DEBUG': false,
     },
  },
  modules: ['@nuxtjs/supabase'],
  css: [
    '@/assets/main.scss',  
    "@mdi/font/css/materialdesignicons.css",
  ],
})
