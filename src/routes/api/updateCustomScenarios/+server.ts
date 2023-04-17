import type { Actions } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
    const formData = await request.json();
    const response = await locals.sb
      .from("Profile")
      .update({
        custom_scenarios: formData.customScenarios,
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