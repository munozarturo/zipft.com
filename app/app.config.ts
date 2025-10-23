export default defineAppConfig({
    ui: {
        colors: {
            primary: "blue",
            neutral: "zinc",
        },
        card: {
            variants: {
                variant: {
                    subtle: {
                        root: "bg-default dark:bg-elevated/50",
                    },
                },
            },
        },
        link: {
            base: "underline focus-visible:no-underline hover:no-underline",
        },
    },
});
