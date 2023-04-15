import { dbSecret } from '$lib/db';

export function GET({request, params}) {
  if(params.key === import.meta.env.VITE_WEBHOOK_SHARED_KEY ) {
    try {
      dbSecret.from("Profile")
        .update({ tokens: 15})
        .lt("tokens", 15)
    } catch (error) {
      console.log(error);
      return new Response('No Cron!');
    } finally {
      return new Response('Yes Cron!');
    }
  }else{
    return new Response('No Cron!');
  }
}