import { dbSecret } from '$lib/db';

export function GET({request, params}) {
  if(params.key === import.meta.env.VITE_WEBHOOK_SHARED_KEY ) {
    try {
      let data = dbSecret.from("Profile")
        .update({ tokens: 15})
        .lt("tokens", 15)
        .select()
        .then((data) => {
          return data;
        });
      return new Response('Yes Cron!');
    } catch (error) {
      console.log(error);
      return new Response('No Cron!');
    } finally {
      return new Response('No Cron!');
    }
  }else{
    return new Response('No Cron!');
  }
}