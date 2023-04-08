import Stripe from "stripe";
import type { RequestEvent, RequestHandler } from "./$types";
import { dbSecret } from "$lib/db";

export const POST: RequestHandler = async (event: RequestEvent) => {
  let rawBody = await event.request.text();
  const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
    // @ts-ignore
    apiVersion: "2020-08-27",
  })
  const sig = event.request.headers.get('stripe-signature');
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
    const profileId: string = session.metadata.profileId

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
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }else{
    }


    // Update profile
    const { data, error } = await dbSecret.from('profiles').update({ tokens: profileData.data.tokens + 1000, total_paid: profileData.data.total_paid + 0.50 }).eq('id', profileId)
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

  }
  return new Response();
};