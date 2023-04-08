import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";

export const GET: RequestHandler = async ({ locals }) => {
  // Get User Profile
  const profileData = await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()

  const webHookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET

  const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
    // @ts-ignore
    apiVersion: "2020-08-27",
  })

  if (webHookSecret && stripe) {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: '1000 Generations',
            },
            unit_amount: 50,
          },
          quantity: 1,
        },
      ],
      metadata: {
        profileId: profileData.data!.id
      },
      payment_method_types: [
        'card',
      ],
      success_url: 'https://aitarot.websitle/success',
      cancel_url: 'https://aitarot.websitle/cancel',
    });

    return new Response(
      JSON.stringify({
        sessionUrl: stripeSession.url,
      }),
    );

  }
  return new Response(
    JSON.stringify({
      error: 'No profile found',
    }),
  )
};