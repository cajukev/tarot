import Stripe from "stripe";
import type { RequestEvent, RequestHandler } from "./$types";
import { dbSecret } from "$lib/db";

export const POST: RequestHandler = async (event: RequestEvent) => {
  let rawBody = await event.request.text();
  console.log('rawBody', rawBody)
  const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  })
  const sig = event.request.headers.get('stripe-signature');
  console.log('sig', sig)
  let stripeEvent;
  try {
    // @ts-ignore
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, import.meta.env.VITE_STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.log('err', err)
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    // @ts-ignore
    const profileId: string = session.metadata.profileId;

    const profileData = await dbSecret.from('Profile')
      .select('*')
      .eq('id', profileId)
      .limit(1)
      .single()


    if (!profileData.data) {
      return new Response(
        JSON.stringify({
          error: 'No profile found',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }else{
    }


    // Update profile
    // @ts-ignore
    const { data, error } = await dbSecret.from('Profile').update({ tokens: profileData.data.tokens + parseInt(session.metadata.tokenAmount), total_paid: profileData.data.total_paid + parseInt(session.metadata.amountPaid) }).eq('id', profileId)
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

  }
  return new Response();
};