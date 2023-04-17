import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({request, locals}) => {
        const formData = await request.formData();
        const email = formData.get('email') + "";
        if (!email) {
            return {
                status: 400,
                body: 'Missing email'
            };
        }

        const user = await locals.sb.auth.signInWithOtp({ email })

        if (!user) {
            return {
                status: 400,
                body: 'User not found'
            };
        }
        throw redirect(300, '/checkemail')

    },

    loginPW: async ({request, locals}) => {
        const formData = await request.formData();
        console.log(formData)
        const email = formData.get('email') + "";
        const password = formData.get('password') + "";
        if (!email || !password) {
            return {
                status: 400,
                body: 'Missing email or password'
            };
        }

        const user = await locals.sb.auth.signInWithPassword({ email, password })

        if (!user) {
            return {
                status: 400,
                body: 'User not found'
            };
        }
        throw redirect(300, '/checkemail')

    },

  logout: async ({ locals}) => {
    const error = await locals.sb.auth.signOut();
    throw redirect(303, '/')
}
    
};
