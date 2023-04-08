<script lang="ts">
	import { enhance } from "$app/forms";
  export let form: any;
  let loading = false;
</script>
<main>
	<!-- Return -->
	<a href="/">&larr; Return</a>
  <!-- Login form -->
  <form
		method="POST"
		action="?/login"
		use:enhance={({ form }) => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				update();
			};
		}}
	>
  <input type="text" name="email" placeholder="Email" />
  <!-- <input type="password" name="password" placeholder="Password" /> -->
  <button type="submit" disabled={loading}>Send link</button>

</form>
</main>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 1rem;
  }
  input[type='text'] {
		display: block;
		font-family: $other-font;
		font-size: $button-font-size;
		text-align: center;
		width: 20rem;
		max-width: calc(100vw - 1rem);
		padding: 0.25rem;
		background-color: $off-white;
		border: none;
		outline: none;
		box-shadow: 0.2rem 0.2rem 0px #a79c8f;
		transition: transform 0.25s ease, box-shadow 0.25s ease;
	}
	input[type='text']:focus {
		box-shadow: 0.6rem 0.6rem 0px #72675b;
		transform: translate(-0.2rem, -0.2rem);
		transition: transform 0.25s ease, box-shadow 0.5s ease;
	}
	button[type='submit'] {
		margin-top: 1rem;
		display: block;
		font-family: $other-font;
		font-size: $button-font-size;
		display: inline-block;
		width: 20rem;
		max-width: calc(100vw - 1rem);
		padding: 0.25rem 0.5rem;
		background-color: $off-white;
		color: white;
		border-radius: 0.5rem;
		border: none;
		outline: none;
		box-shadow: 0.2rem 0.2rem 0px #a79c8f;
		transition: transform 0.25s ease, box-shadow 0.25s ease;
		&:focus,
		&:hover {
			box-shadow: 0.6rem 0.6rem 0px #72675b;
			transform: translate(-0.2rem, -0.2rem);
			transition: transform 0.25s ease, box-shadow 0.5s ease;
			cursor: pointer;
		}
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>