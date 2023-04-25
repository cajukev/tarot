import type { Actions, RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async ({ request, locals }) => {
    const formData = await request.json();
    const response = await locals.sb
      .from("Profile")
      .update({
        custom_spreads: formData.customSpreads,
      })
      .eq("id", locals.session?.user?.id)
      .then((response) => {
        return JSON.stringify({
          status: 200,
          body: response,
        });
      });
    return new Response(response);
  }