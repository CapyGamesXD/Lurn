<script>
	//@ts-nocheck
	import { goto } from '$app/navigation';

	let userInput = $state('');

	async function save() {
		if (userInput != '') {
			await localStorage.setItem('username', userInput);
			goto('/');
		}
	}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
	rel="stylesheet"
/>

<div class="fullcenterdiv">
	<h1>Welcome to Lurn</h1>
	<p>Looks like you're new here! Please enter your desired username</p>
	<div class="divider"></div>
	<input placeholder="e.g, CapyBara" bind:value={userInput} />
	<button onclick={save}>Save</button>
</div>
