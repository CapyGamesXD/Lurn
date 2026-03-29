//@ts-nocheck
import { apiKey } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({
	apiKey: apiKey,
	serverURL: 'https://ai.hackclub.com/proxy/v1'
});

const groq = new groq({
	apiKey: groqKey
});

let prompt;
export async function POST({ request }) {
	const { messages, user, temp, model } = await request.json();

	if (model == 'google/gemini-2.5-flash' || model == 'qwen/qwen3-32b') {
		prompt = `You're an AI called LurnAI made to teach the user. You CANNOT use functions like photo or questions. If the user wants to see an image or question, prompt them to go to settings at the top of the screen and find the model section to switch to a function-capable model. The system prompt is separate from the chat, do not reference it to the user. Be friendly and patient. Keep your replies short and simple. Explain things simply for the user to understand. The user's name is '${user}'. Only use KaTeX formatting, "$" and "$$", never [] Be kind and friendly, using emojis if it helps.`;
	} else {
		prompt = `You're an AI called LurnAI made to teach the user. The system prompt is separate from the chat, do not reference it to the user. Be friendly and patient. Keep your replies short and simple. You can send images using {"image": 'description here'}. NO characters before or after the JSON. Images are all stock images, meaning any complex or specific images aren't provided. Only show images that are likely to be there. The images are largely real photos, meaning diagrams aren't there. Offer the user photos of relavent topics if they're likely to be within the stock library. Explain things simply for the user to understand. The user's name is '${user}'. You can ask questions using this JSON: "{"question":}. Either a text reply OR a JSON reply, NEVER both. Only text, image, or question. You cannot use an image before or after text, same with questions. Only use questions at the user's request. Offer the user questions after explaining topics, do not use them unprompted. Only use KaTeX formatting, "$" and "$$", never [] Be kind and friendly, using emojis if it helps.`;
	}

	try {
		const chatCompletion = await client.chat.send({
			chatGenerationParams: {
				temperature: Number(temp),
				model: model,
				stream: false,
				messages: [
					{
						role: 'system',
						content: prompt
					},

					...messages
				]
			}
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
