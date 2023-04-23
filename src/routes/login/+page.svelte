<script lang="ts">
	import { enhance } from '$app/forms';
	export let form: any;
	let loading = false;
	let email = '';
	let password = '';
	let error = '';
</script>

<main>
	<div class="container">
		<!-- Return -->
		<a href="/" class="return"><h4>&larr; Return</h4></a>
		<!-- Login form -->
		<form
			method="POST"
			action={password.length !== 0 ? "?/loginPW" : "?/login"}
			use:enhance={({ form }) => {
				loading = true;
				return async ({ result, update }) => {
					console.log(result);
					if(result.data){
						error = result.data.body;
						loading = false;
					}
					update();

				};
			}}
		>
			<input type="text" name="email" placeholder="Email" bind:value={email} />

				<input type="password" name="password" placeholder="Password" bind:value={password} />


			<button type="submit" disabled={email?.length === 0}>{ password?.length === 0 ? "Email me a login link" : "Login"}</button>
			{#if email?.length > 0 && password?.length > 0}
				<!-- Sign up btn -->
				<button type="submit" formaction="?/signup" >Sign up</button>
			{/if}
			<p class="error">{error}</p>
			{#if email?.length > 0 && password?.length === 0}
				<p class="passwordlessInfo">By sending a login link to an email without an existing account, you will create a passwordless account.<br> You will not be able to add one later.</p>
			{/if}
			<p class="policy">
				By signing up, you agree to our <a href="/privacypolicy">privacy policy</a>
			</p>
		</form>
	</div>
</main>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		text-align: center;
	}
	.return {
		margin: 2rem;
		color: rgba($color: white, $alpha: 0.7);
	}
	form {
		display: flex;
		flex-direction: column;
		width: fit-content;
		align-items: center;
		gap: 1rem;
	}
	input[type='text'] {
		display: block;
		font-family: $other-font;
		font-size: $h4-font-size;
		text-align: center;
		width: 20rem;
		max-width: calc(100vw - 1rem);
		padding: 0.25rem;
		background-color: $off-white;
		border: none;
		outline: none;
		box-shadow: 0.2rem 0.2rem 0px #a79c8f;
		transition: all 0.25s ease;
	}
	input[type='password'] {
		display: block;
		font-family: $other-font;
		font-size: $h4-font-size;
		text-align: center;
		width: 20rem;
		max-width: calc(100vw - 1rem);
		padding: 0.25rem;
		background-color: $off-white;
		border: none;
		outline: none;
		box-shadow: 0.2rem 0.2rem 0px #a79c8f;
		transition: all 0.25s ease;
	}
	button[type='submit'] {
		margin-top: 1rem;
		display: block;
		font-family: $other-font;
		font-size: $h4-font-size;
		display: inline-block;
		max-width: calc(100vw - 1rem);
		padding: 0.5rem 1.5rem;
		background-color: $accent;
		border-radius: 0.5rem;
		border: none;
		outline: none;
		box-shadow: 0.2rem 0.2rem 0px rgba($color: $accent, $alpha: 0.7);
		transition: all 0.25s ease;
		animation: jump 3s ease infinite;
		&:focus,
		&:hover {
			box-shadow: 0.6rem 0.6rem 0px rgba($color: $accent, $alpha: 0.4);
			cursor: pointer;
		}
		&:disabled {
			opacity: 0.8;
			background-color: $off-white;
			box-shadow: 0.2rem 0.2rem 0px #a79c8f;
			cursor: not-allowed;
			pointer-events: none;
			animation: none;
		}
	}
	.error{
		color: rgb(255, 103, 103);
	}
	.policy a {
		color: rgba($color: white, $alpha: 0.7);
	}
	@keyframes jump {
		0% {
			transform: translate(0, 0);
		}
		10% {
			transform: translate(0, -0.25rem);
		}
		20% {
			transform: translate(0, 0);
		}
	}
</style>
