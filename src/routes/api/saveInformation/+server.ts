import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request, locals}) => {
    const formData: {
        information: string;
    } = await request.json();
    const information = formData.information.slice(0, 500)


    const informationId = await locals.sb
    .from('Profile')
    .update({
        information: information
    })
    .eq('id', locals.session?.user?.id)
    .then((response) => {
        return JSON.stringify({
            status: 200,
            body: response
        })
    })

    return new Response(informationId);
};