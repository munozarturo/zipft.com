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
        },
    },
    runtimeConfig: {
        enviornment: "development",
        baseUrl: "http://172.20.54.152:3000/",
        cookies: { domain: undefined },
        brand: { mailFrom: "zipft.com" },
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
