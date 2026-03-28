<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import appleIcon from '$lib/assets/apple-touch-icon.png';

	import '../styling.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={appleIcon} />
</svelte:head>

{@render children()}
