<script>
	//@ts-nocheck

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let temp = $state(6);
	let model = $state('qwen/qwen3-32b');
	let window = $state(16);
	let darkMode;
	onMount(() => {
		temp = localStorage.getItem('temp') == null ? 6 : localStorage.getItem('temp') * 10;
		model = localStorage.getItem('model');
		window = localStorage.getItem('window') || 16;
		darkMode = localStorage.getItem('dark') === 'true';
		console.log(darkMode);
		console.log(model);
		console.log('saved as', localStorage.getItem('temp'));
	});

	function home() {
		localStorage.setItem('temp', (temp / 10).toPrecision(1).toString());
		localStorage.setItem('model', model);
		localStorage.setItem('window', window);
		console.log(localStorage.getItem('temp'));
		goto('/');
	}

	$effect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
		document.body.classList.toggle('dark', darkMode);
		localStorage.setItem('dark', darkMode);
	});
</script>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
	integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
	crossorigin="anonymous"
/>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
	rel="stylesheet"
/>

<div class="centerdiv">
	<div class="glassBack">
		<button onclick={home} class="simple" aria-label="Home button">
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
				class="lucide lucide-house-icon lucide-house"
				><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path
					d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
				/></svg
			>
		</button>
	</div>

	<h1>AI Settings:</h1>

	<div class="divider"></div>
	<a class="fancyLink" href="about">About Lurn</a>
	<p>Below are AI customisation parameters.</p>
	<div class="divider"></div>
	<p>Choose a model</p>
	<select bind:value={model}>
		<option value="openai/gpt-oss-120b"> GPT-OSS-120B (function capable) </option>

		<option value="google/gemini-2.5-flash"> Gemini-2.5-Flash </option>

		<option value="qwen/qwen3-32b"> Qwen-32B </option>
	</select>
	<div class="divider"></div>
	<p>Temperature:</p>
	<input type="range" class="slider" min="0" max="10" bind:value={temp} />
	<p>{(temp / 10).toPrecision(1)} <br /> Default: ~0.6</p>
	<div class="divider"></div>
	<p>Context Window:</p>
	<input type="range" class="slider" min="2" max="30" bind:value={window} />
	<p>{window} <br /> Default: 16</p>
</div>
