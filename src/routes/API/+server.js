//@ts-nocheck
import { apiKey } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: apiKey });

export async function POST({ request }) {
	const { messages, user, temp, model } = await request.json();

	try {
		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `You're an AI called LurnAI made to teach the user. Keep your replies short and simple. You can send images using {"image": 'description here'}. Images are all stock images, meaning any complex or specific images aren't provided. Only show images that are likely to be there. The images are largely real photos, meaning diagrams aren't there. Offer the user photos of relavent topics if they're likely to be within the stock library. Explain things simply for the user to understand. The user's name is ${user}. You can ask questions using this JSON: "{"question":}. Either a text reply OR a JSON reply, NEVER both. Only text, image, or question. Only use questions at the user's request. Offer the user questions after explaining topics, do not use them unprompted. Only use KaTeX formatting, "$" and "$$", never [] Be kind and friendly, using emojis if it helps.`
				},

				...messages
			],
			temperature: Number(temp),
			model: model
		});

		console.log(messages);
		const reply = chatCompletion.choices[0]?.message?.content || '';
		return json({ reply }, { status: 201 });
	} catch (e) {
		console.error(e);
		return json(
			{
				reply:
					"Sorry, we're experiencing server-side issues right now. Please try another model in settings, or try again later."
			},
			{ status: 201 }
		);
	}
}
