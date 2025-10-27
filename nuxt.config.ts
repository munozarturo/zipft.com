import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    $production: {
        runtimeConfig: {
            enviornment: "production",
            baseUrl: "https://zipft.com",
            cookies: { domain: ".zipft.com" },
            public: {
                baseUrl: "https://zipft.com",
            },
        },
    },
    runtimeConfig: {
        enviornment: "development",
        cookies: { domain: undefined },
        brand: { mailFrom: "zipft.com" },
        public: {
            baseUrl: "http://127.0.0.1:3000",
        },
    },
    app: {
        head: {
            title: "zipft",
            htmlAttrs: {
                lang: "en",
            },
            script: [{ src: "/scripts/favicon.js" }],
        },
    },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    imports: { dirs: ["~/shared/schema/*"] },
    nitro: {
        imports: { dirs: ["~/shared/schema/*"] },
    },
    modules: [
        "@nuxt/ui",
        "@nuxt/image",
        "@nuxt/icon",
        "@nuxt/fonts",
        "@nuxt/content",
    ],
});
