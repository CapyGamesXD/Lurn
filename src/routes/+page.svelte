<script>
	//@ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';
	import { json } from '@sveltejs/kit';

	let user = $state('');
	let messages = $state([]);

	let input = $state('');
	let question = $state('');

	onMount(() => {
		user = localStorage.getItem('username') || '';

		if (user == '') {
			goto('/welcome');
		}
	});
	const options = {
		throwOnError: false,
		nonStandard: true
	};

	marked.use(markedKatex(options));

	async function send() {
		if (input) {
			if (messages.length <= 4) {
				messages = [...messages, { role: 'user', content: input }];
			} else {
				messages.shift();
				messages = [...messages, { role: 'user', content: input }];
			}

			const response = await fetch('/API', {
				method: 'POST',
				body: JSON.stringify({ messages, user }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			input = '';
			question = '';
			const data = await response.json();
			let reply = data.reply;
			try {
				question = JSON.parse(reply);
				console.log(question);

				messages = [...messages, { role: 'assistant', content: question.question }];
			} catch {
				console.log('No question!');
				reply = reply.split('{"question"')[0].trim();
				if (messages.length <= 20) {
					messages = [...messages, { role: 'assistant', content: reply }];
				} else {
					messages.shift();
					messages = [...messages, { role: 'assistant', content: reply }];
				}
			}
		}
	}

	function clear() {
		messages = [];
	}

	function restart() {
		localStorage.clear();
		goto('/welcome');
	}
</script>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
	integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
	crossorigin="anonymous"
/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
	rel="stylesheet"
/>
<div class="centerdiv">
	<div id="confirm" popover>
		<p>Are you sure you want to delete this chat?</p>
		<div class="divider"></div>
		<button popovertarget="confirm" popovertargetaction="hide">Cancel</button>
		<button popovertarget="confirm" popovertargetaction="hide" onclick={clear}>Delete</button>
	</div>

	<div id="restart" popover>
		<p>Are you sure you want to restart setup?</p>
		<div class="divider"></div>
		<button popovertarget="restart" popovertargetaction="hide">Cancel</button>
		<button popovertarget="restart" popovertargetaction="hide" onclick={restart}>Restart</button>
	</div>

	<div class="glass">
		<button class="simple" aria-label="restart button" popovertarget="restart"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"
				><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg
			></button
		>

		<button class="simple" aria-label="clear button" popovertarget="confirm"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-trash-icon lucide-trash"
				><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path
					d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
				/></svg
			></button
		>
	</div>

	{#if messages.length == 0}
		<div class="fullcenterdiv">
			<h1>Welcome back, {user}</h1>
			<div class="divider"></div>

			<p>Ready to dive in?</p>
		</div>
	{:else if question == ''}
		<div class="messages">
			{#each messages as msgs}
				{#if msgs.role == 'user'}
					<h2>You:</h2>
					<p>{@html marked(msgs.content)}</p>
				{:else if msgs.role == 'assistant'}
					<h2>Assistant:</h2>
					<p>{@html marked(msgs.content)}</p>
				{/if}
			{/each}
		</div>
	{/if}
	{#if question != ''}
		<div class="fullcenterdiv">
			<div class="question">
				<h2>Question:</h2>
				<p>{@html marked(question.question)}</p>
				<div class="divider"></div>
				<div class="row">
					<input
						placeholder="Answer Here"
						class="userInput"
						bind:value={input}
						onkeydown={(e) => e.key === 'Enter' && send()}
					/>
					<button class="plus" aria-label="Send Button" onclick={send}></button>
				</div>
			</div>
		</div>
	{/if}

	{#if question == ''}
		<div class="bottom">
			<input
				class="userInput"
				placeholder="Teach me about capybaras!"
				bind:value={input}
				onkeydown={(e) => e.key === 'Enter' && send()}
			/>
			<button class="plus" aria-label="Send Button" onclick={send}></button>
		</div>
	{/if}
</div>
