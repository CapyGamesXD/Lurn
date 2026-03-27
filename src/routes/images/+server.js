import { imageKey } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { imageQuery } = await request.json();
		const response = await fetch(
			`https://api.pexels.com/v1/search?query=${imageQuery}nature&per_page=1`,
			{
				headers: {
					Authorization: imageKey
				}
			}
		);
		const data = await response.json();
		const image = data.photos[0].src.medium;
		console.log('the image is', image);
		return json({ image }, { status: 201 });
	} catch (e) {
		console.error(e);
	}
}
