import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({locals}) => {
  
  return new Response();
};

export const POST: RequestHandler = async ({ request, locals }) => {
  console.log('request', request)
  const formData: {
    information: string;
  } = await request.json();
  console.log('formData', formData)
  const information = formData.information
  console.log('information', information)
  if (!information) {
    return new Response(
      JSON.stringify({
        status: 400,
        body: 'Missing information'
      })
    );
  }
  const response = await locals.sb.rpc('create_information', {
    new_information: information,
    user_id: locals.session?.user?.id
  })
  .then((response) => {
    console.log('response', response)
    return JSON.stringify({
      status: 200,
      body: response
    })
  })
  console.log('response', response)
  
  if (!response) {
    return new Response(
      JSON.stringify({
        status: 500,
        body: 'Error creating the information'
      })
    );
  }
  console.log('response', response)


  return new Response(
    response
  );
}
