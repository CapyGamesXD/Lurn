<script>
	import { page } from '$app/state';
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
	rel="stylesheet"
/>

<div class="centerdiv">
	<h1>Oh no!</h1>
	<h1>{page.status}</h1>
	<p>{page.error?.message}</p>
	<div class="divider"></div>
	<p>
		Hey, Capy here! It seems as though this page isn't working! Let's troubleshoot. <br /> First, check
		the page URL is right, with no incorrect routes (.com/XYZ)
	</p>
	<div class="divider"></div>

	<p>
		Okay, if you've tried that and are still here, let's try something else... Try navigate to the
		home page!
		<a href="/">Here!</a> <br />
		Hmmm... Still here? Try waiting! It might be a hosting issue. If you continue to have issues, try
		contact me. :D
	</p>
</div>
