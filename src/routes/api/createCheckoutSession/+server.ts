import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";
import { shopItems } from "$lib/shop";

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    item: string;
  } = await request.json();

  // Get User Profile
  const profileData = await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()

  // Get shop Item
  const shopItem = shopItems.get(formData.item);

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
            currency: 'usd',
            product_data: {
              name: `${shopItem?.description}`,
            },
            unit_amount: shopItem?.cost,
          },
          quantity: 1,
        },
      ],
      metadata: {
        profileId: profileData.data!.id,
        tokenAmount: shopItem!.amount,
        amountPaid: shopItem!.cost,
      },
      payment_method_types: [
        'card',
      ],
      success_url: 'https://aitarot.website/success',
      cancel_url: 'https://aitarot.website',
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