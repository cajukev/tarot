import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    const reading = await locals.sb.from('Reading')
        .select('reading')
        .eq('id', params.id)
        .single()
        .then((reading) => {
            if (reading) {
                console.log(reading.data);
                return reading.data;
            } else {
                return null;
            }
        })

    return {
        data: {
            reading: await reading,
        }
    }
};