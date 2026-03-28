<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	let darkMode;
	onMount(() => {
		darkMode = localStorage.getItem('dark') === 'true';
		console.log(darkMode);
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
		document.body.classList.toggle('dark', darkMode);
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
		<a href="/" class="simple" aria-label="Home button">
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
		</a>
	</div>

	<h1>What it is:</h1>

	<p>
		Lurn is a project I made to help myself and others study more effectively! <br /> I found that
		staring at a textbook for hours wasn't effective for me, so I made this! It's an AI tool that
		teaches you in a way that you can learn. <br />If you face any server-side issues, it might be
		caused by excessive traffic for my API key, as it's a free tier. :( I'd just like to say
		(because I think a lot of people have doubts), I did NOT use AI to write this summary. I wrote
		it all myself, so sorry if there are any typos! (I kinda yapped, so sorry about that too.)
	</p>

	<h1>Secret features:</h1>
	<div class="divider"></div>

	<p>
		Lurn has two "special" features, being its quiz and image function! Ask the AI to give you a
		quiz or question, or an image and it'll open in a new UI! Disclaimer: this might not work as
		well when using the smaller models available due to their inherent 'disobedience' (i.e, they're
		a bit stupid...)
	</p>
	<div class="divider"></div>
</div>
