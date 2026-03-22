//@ts-nocheck
import { apiKey } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: apiKey });

export async function POST({ request }) {
	const { messages, user } = await request.json();

	const chatCompletion = await groq.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You're an AI with the goal of teaching the user. Keep responses simple and short.  Be friendly and encouraging. The user's name is ${user}. Don't greet them on every message or overuse their name. You can create a json object with a "question" parameter. When asking a question, ONLY use this json {"question": }, NO other text before or after. Offer the user questions when appropriate. Only ask questions when the user wants them, not unprompted. Use dividers where necessary. Only use question JSON if the user wants a question. Do NOT mix text and JSON in a message. Only use KaTeX formatting,'$$' and '$', NEVER [].`
			},

			...messages
		],

		model: 'openai/gpt-oss-120b'
	});

	console.log(messages);
	const reply = chatCompletion.choices[0]?.message?.content || '';

	return json({ reply }, { status: 201 });
}
