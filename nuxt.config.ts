// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    pages: true,
    modules: [
        'nuxt-icon',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})
