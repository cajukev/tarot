import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request, locals}) => {
    const formData: {
        reading: ReadingType;
    } = await request.json();
    const reading = formData.reading;
    
    // Get reading first
    const readingId = await locals.sb.from('Reading')
        .insert({
            reading: reading,
        })
        .select('id')
        .then((reading) => {
            if (reading) {
                console.log(reading);
                return reading;
            } else {
                return null;
            }
        }
    );
    return new Response(
        JSON.stringify({
            status: 200,
            body: {
                reading: readingId,
            }
        }),
    );

        
    
};