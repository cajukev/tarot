import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals }) => {
    const error = await locals.sb.auth.signOut();
    return new Response(JSON.stringify(
        {
            error: error,
            status: 200 
        }));
}