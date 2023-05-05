<script lang="ts">
  import { timeVariableStore } from "../stores";
  import { onMount } from "svelte"
  
	let timeVarInterval: NodeJS.Timeout;
	onMount(() => {
		clearInterval(timeVarInterval);
		timeVarInterval = setInterval(() => {
			timeVariableStore.set(($timeVariableStore + 1) % 11);
		}, 500);
	});
</script>

  <h1 class="screenPadding">
		<span class={$timeVariableStore === 0 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>Call </span>
		<span class={$timeVariableStore === 1 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>upon </span>
		<span class={$timeVariableStore === 2 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>the </span>
		<span class={$timeVariableStore === 3 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>power </span>
		<span class={$timeVariableStore === 4 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>of </span>
		<span class={$timeVariableStore === 5 || $timeVariableStore === 7 || $timeVariableStore === 9 || $timeVariableStore === 11  ? "illuminated" : ""}>Tarot</span>
	</h1>

<style lang="scss">
  h1 {
			padding-top: 2rem;
			text-align: center;
			text-shadow: 0rem 0rem 0.4rem rgba(255, 255, 255, 0.137);
			span {
				transition: all 0.25s ease-in-out;
				&.illuminated {
					text-shadow: -0.2rem 0.2rem 0.6rem rgba(235, 228, 209, 0.637),
						0.2rem -0.2rem 0.4rem rgba(45, 135, 177, 0.822);
				}
			}
		}
</style>