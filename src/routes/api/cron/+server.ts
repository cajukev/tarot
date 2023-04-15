import { dbSecret } from '$lib/db';

export function GET() {
  dbSecret.from("Profile")
  .update({ tokens: 15})
  .lt("tokens", 15)
  .then((data) => {
    console.log(data);
  });
    
  return new Response('Hello Cron!');
}