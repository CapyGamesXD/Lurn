<script>
	//@ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';
	import { json } from '@sveltejs/kit';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/stackoverflow-dark.css';

	let user = $state('');
	let messages = $state([]);
	let displayMessages = $state([]);
	let input = $state('');
	let question = $state('');

	let scrollDiv = $state();
	let darkMode = $state(false);
	let temp = $state(Number(0.6));
	let model = $state('');
	let image = $state('');
	let imageQuery = $state('');
	let ready = false;
	let contWindow = 16;
	let loading = $state(false);
	onMount(async () => {
		messages = JSON.parse(localStorage.getItem('messages')) || [];
		displayMessages = JSON.parse(localStorage.getItem('displayMessages')) || [];
		temp = localStorage.getItem('temp') || 0.6;
		console.log('The temperature is currently:', temp);
		user = localStorage.getItem('username') || '';
		darkMode = localStorage.getItem('dark') === 'true';
		model = localStorage.getItem('model') || 'openai/gpt-oss-120b';
		contWindow = localStorage.getItem('window') || 16;

		if (user == '') {
			goto('/welcome');
		}
		ready = true;
		requestAnimationFrame(() => {
			theySeeMeScrolling();
		});
	});
	const options = {
		throwOnError: false,
		nonStandard: true
	};
	function clearImage() {
		image = '';
		question = '';

		requestAnimationFrame(() => {
			theySeeMeScrolling();
		});
	}

	const theySeeMeScrolling = () => {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth'
		});
	};
	marked.use(markedKatex(options));

	async function fetchImage(search) {
		const response = await fetch('/images', {
			method: 'POST',
			body: JSON.stringify({ imageQuery }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		image = data.image;
		console.log('image URL is:', image);
	}

	async function send() {
		loading = true;
		console.log('loading, ', loading);
		if (input) {
			displayMessages = [...displayMessages, { role: 'user', content: input }];
			if (messages.length <= contWindow) {
				messages = [...messages, { role: 'user', content: input }];
			} else {
				messages.shift();
				messages = [...messages, { role: 'user', content: input }];
			}

			await tick();
			theySeeMeScrolling();
			hljs.highlightAll();

			const response = await fetch('/API', {
				method: 'POST',
				body: JSON.stringify({ messages, user, temp, model }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			input = '';
			question = '';
			image = '';
			const data = await response.json();
			let reply = data.reply;
			console.log(reply);

			try {
				const parsed = JSON.parse(reply);
				if (parsed.question) {
					question = parsed.question;
					messages = [...messages, { role: 'assistant', content: `Question: ${question}` }];
					displayMessages = [
						...displayMessages,
						{ role: 'assistant', content: `Question: ${question}` }
					];
					console.log(reply);
				} else if (parsed.image) {
					imageQuery = parsed.image;
					messages = [...messages, { role: 'assistant', content: `Image,  ${imageQuery}` }];
					displayMessages = [
						...displayMessages,
						{ role: 'assistant', content: `Image: ${imageQuery}` }
					];
					await fetchImage(imageQuery);
					console.log(reply);
				}
			} catch {
				console.log('No question!');
				reply = reply.split('{"question"')[0].trim();
				if (messages.length <= 20) {
					messages = [...messages, { role: 'assistant', content: reply }];
				} else {
					messages.shift();
					messages = [...messages, { role: 'assistant', content: reply }];
				}
				displayMessages = [...displayMessages, { role: 'assistant', content: reply }];
				await tick();
				theySeeMeScrolling();
				hljs.highlightAll();
				console.log(reply);
			}

			loading = false;
			console.log(loading);
		}
	}

	function clear() {
		messages = [];
		displayMessages = [];
		input = '';
		question = '';
		image = '';
	}

	function restart() {
		localStorage.clear();
		goto('/welcome');
	}

	function toggle() {
		darkMode = !darkMode;
		localStorage.setItem('dark', darkMode);
	}
	$effect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
		document.body.classList.toggle('dark', darkMode);
		localStorage.setItem('dark', darkMode);
	});

	$effect(() => {
		if (ready) {
			localStorage.setItem('messages', JSON.stringify(messages));
			localStorage.setItem('displayMessages', JSON.stringify(displayMessages));
		}
	});
</script>

<!--This documentElement was courtesy of Claude. -->
<svelte:head>
	<title>LurnAI</title>
	<meta property="og:description" content="Your description here" />
	<meta property="og:image" content="https://lurn.capydesigns.com/LurnAI.png" />
	<script>
		if (localStorage.getItem('dark') === 'true') {
			document.documentElement.classList.toggle('dark');
		}
	</script>
</svelte:head>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
	integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
	crossorigin="anonymous"
/>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
	rel="stylesheet"
/>

<div class="centerdiv">
	<div id="confirm" popover>
		<p>Are you sure you want to delete this chat?</p>
		<div class="divider"></div>
		<button popovertarget="confirm" popovertargetaction="hide" onclick={clear} class="scaryButton"
			>Delete</button
		>
		<button popovertarget="confirm" popovertargetaction="hide">Cancel</button>
	</div>

	<div id="restart" popover>
		<p>Are you sure you want to restart setup?</p>
		<div class="divider"></div>
		<button popovertarget="restart" popovertargetaction="hide" onclick={restart} class="scaryButton"
			>Restart</button
		>
		<button popovertarget="restart" popovertargetaction="hide">Cancel</button>
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

		<button class="simple" onclick={toggle} aria-label="Dark mode toggle"
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
				class="lucide lucide-moon-icon lucide-moon"
				><path
					d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
				/></svg
			></button
		>

		<a class="simple" aria-label="Settings Button" href="/settings"
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
				class="lucide lucide-settings-icon lucide-settings"
				><path
					d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
				/><circle cx="12" cy="12" r="3" /></svg
			></a
		>
	</div>

	{#if displayMessages.length == 0 && image == ''}
		<div class="fullcenterdiv">
			<h1 class="fadeText">Welcome back, {user}</h1>
			<div class="divider"></div>

			<p class="fadeText">Ready to dive in?</p>
		</div>
	{:else if question == '' && image == ''}
		<div class="messages">
			{#each displayMessages as msgs}
				{#if msgs.role == 'user'}
					<h2>You:</h2>
					<p>{@html marked(msgs.content)}</p>
				{:else if msgs.role == 'assistant'}
					<h2>Assistant:</h2>
					<p>{@html marked(msgs.content)}</p>
				{/if}
			{/each}
			{#if loading == true}
				<p>LOADINGGG!</p>
			{/if}
		</div>

		<div class="scrollDiv" bind:this={scrollDiv}></div>
	{/if}
	{#if question != '' && image == ''}
		<div class="fullcenterdiv">
			<div class="question">
				<button onclick={clearImage} class="simple" aria-label="Close button for question">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-circle-x-icon lucide-circle-x"
						><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg
					>
				</button>
				<h2>Question:</h2>
				<p>{@html marked(question)}</p>
				<div class="divider"></div>
				<div class="row">
					<input
						placeholder="Answer Here"
						bind:value={input}
						onkeydown={(e) => e.key === 'Enter' && send()}
					/>
					<button class="plus" aria-label="Send Button" onclick={send}></button>
				</div>
			</div>
		</div>
	{/if}

	{#if image != ''}
		<div class="messages">
			<button onclick={clearImage} aria-label="Close button for image">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-circle-x-icon lucide-circle-x"
					><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg
				></button
			>
			<img src={image} alt="AI selected media" />
		</div>
	{/if}

	{#if question == ''}
		<div class="bottom">
			<textarea
				class="userInput"
				placeholder="Teach me about capybaras!"
				bind:value={input}
				onkeydown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
			></textarea>

			<button class="plus" aria-label="Send Button" onclick={send}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-arrow-up-icon lucide-arrow-up"
					><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
				></button
			>
		</div>
	{/if}
</div>
