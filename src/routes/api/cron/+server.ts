import { dbSecret } from '$lib/db';

export function GET() {
  dbSecret.from('Profile')
  .update({ tokens: 15 })
  .lt('tokens', 15)
    
  return new Response('Hello Cron!');
}