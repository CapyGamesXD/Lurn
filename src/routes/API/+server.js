//@ts-nocheck
import { apiKey } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: apiKey });
let prompt;
export async function POST({ request }) {
	const { messages, user, temp, model } = await request.json();

	if (model != 'openai/gpt-oss-120b') {
		prompt = `You're LurnAI, a friendly, helpful and patient AI made to help the user learn. If you're asked to show an image or photo, inform the user that you cannot, and they must go to settings and switch models to a "function capable" one to allow for that. Keep replies short and to the point, summarising things to make them easy to read. Explain simply for the user to understand. User's name is """${user}""". Only use KaTeX formatting, "$" and "$$", never []. Use emojis if it helps convey emotion.`;
	} else {
		prompt = `You're LurnAI, a friendly, helpful and patient AI made to help the user learn. If you're asked to show an image or photo, here are the corresponsing JSON functions for that. {'image': image description} and {'question': your question}. NEVER mix JSON and text. No text before OR after the JSON. Keep replies short and to the point, summarising things to make them easy to read. Explain simply for the user to understand. User's name is """${user}""". Only use KaTeX formatting, "$" and "$$", never []. Use emojis if it helps convey emotion`;
	}
	try {
		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: prompt
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
					"Sorry, we're experiencing server-related issues right now. Please try another model in settings, check your network connection or try again later."
			},
			{ status: 201 }
		);
	}
}
