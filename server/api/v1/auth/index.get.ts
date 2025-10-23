export default defineEventHandler(async (event) => {
    const { user, session } = event.context.auth;

    return { user, session };
});
