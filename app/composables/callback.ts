import type { RouteLocationNormalized, RouteLocationRaw } from "vue-router";

export default function useCallback(route?: RouteLocationNormalized) {
    const _route = route || useRoute();

    // Read callback from URL query parameter 'c'
    const callback = computed(() => (_route.query.c as string) || "");

    // Add callback parameter to a RouteLocationRaw
    const withCallback = (
        to: RouteLocationRaw,
        callbackUrl?: string
    ): RouteLocationRaw => {
        const currentCallback = callbackUrl || callback.value;
        if (!currentCallback) return to;

        // Handle string URLs
        if (typeof to === "string") {
            try {
                const url = new URL(to, window.location.origin);
                // Don't override existing callback parameter
                if (!url.searchParams.has("c")) {
                    url.searchParams.set("c", currentCallback);
                }
                return url.pathname + url.search + url.hash;
            } catch {
                // Fallback for relative URLs
                const separator = to.includes("?") ? "&" : "?";
                return to.includes("c=")
                    ? to
                    : `${to}${separator}c=${encodeURIComponent(currentCallback)}`;
            }
        }

        // Handle route objects
        if (typeof to === "object") {
            const routeLocation = { ...to };

            // Ensure query object exists
            if (!routeLocation.query) {
                routeLocation.query = {};
            } else {
                routeLocation.query = { ...routeLocation.query };
            }

            // Don't override existing callback parameter
            if (!routeLocation.query.c) {
                routeLocation.query.c = currentCallback;
            }

            return routeLocation;
        }

        return to;
    };

    return {
        callback: readonly(callback),
        withCallback,
    };
}
