import type { RequestHandler } from "@sveltejs/kit";
import type { ShopItem } from "$lib/shop";

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    item: ShopItem;
  } = await request.json();

  // Get User Profile
  let toReturn: Response;
  return await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()
    .then((res) => res.data)
    .then(async (data) => {
      if (data) {
        let returnError: Response | undefined = undefined;
        if (data.bought_items.includes(formData.item.key)) {
          returnError = new Response(
            JSON.stringify({
              error: 'You already own this item'
            }),
            {
              status: 400
            }
          )
        }
        if (data.essence < (formData.item.amount || 0)) {
          returnError = new Response(
            JSON.stringify({
              error: 'Not enough essence'
            }),
            {
              status: 400
            }
          )
        }
        if (returnError !== undefined) {
          return returnError;
        } else {

          switch (formData.item.type) {
            case 'Tokens':
              console.log('tokens')
              const r1 = locals.sb.from('Profile').update({
                essence: data.essence - (formData.item.cost || 0),
                tokens: data.tokens + (formData.item.amount || 0),
                purchase_history: [...data.purchase_history, {item: formData.item.amount+" Tokens", date: new Date().toLocaleString()}]
              }).eq('id', data.id)
                .then((response) => {
                  return JSON.stringify({
                    status: 200,
                    body: response,
                  });
                });
              toReturn = new Response(await r1);
              break;
            default:
              console.log('default')
              const r2 = locals.sb.from('Profile').update({
                essence: data.essence - (formData.item.cost || 0),
                bought_items: [...data.bought_items, formData.item.key],
                purchase_history: [...data.purchase_history, {item: formData.item.name, date: new Date().toLocaleString()}]
              }).eq('id', data.id)
                .then((response) => {
                  return JSON.stringify({
                    status: 200,
                    body: response,
                  });
                });
              toReturn = new Response(await r2);
          }
          console.log(toReturn)
          return toReturn;
        }
      }
      return new Response(
        JSON.stringify({
          error: 'Something went wrong'
        }),
        {
          status: 400
        }
      );
    });
};