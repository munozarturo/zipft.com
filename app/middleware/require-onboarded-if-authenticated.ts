import useCallback from "~/composables/callback";

export default defineNuxtRouteMiddleware((to) => {
    const { $auth } = useNuxtApp();
    const { withCallback } = useCallback(to);

    if ($auth.isAuthenticated.value) {
        if (!$auth.user?.value?.onboarded) {
            return navigateTo(withCallback("/auth/onboarding", to.fullPath));
        }
    }
});
