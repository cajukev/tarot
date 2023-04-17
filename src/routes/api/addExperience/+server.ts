import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
    const formData = await request.json();
    const profileData = await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()
    const response = await locals.sb
      .from("Profile")
      .update({
        experience: profileData.data?.experience + formData.experience,
      })
      .eq("id", locals.session?.user?.id)
      .then((response) => {
        return JSON.stringify({
          status: 200,
          body: response,
        });
      }
    );
    return new Response(response);
  }