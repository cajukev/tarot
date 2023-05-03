<script lang="ts">
	import { unlocks, type Unlock } from '$lib/unlocks';
	import { page } from '$app/stores';
	import { menuStateStore } from '../stores';
	import Achievements from './Achievements.svelte';
	import Unlocks from './Unlocks.svelte';
	let unlocksArray = Array.from(unlocks.entries());

	

</script>

<div class="container">
	<p class="current">Current experience: {$page.data.profile.data.experience}</p>
	<div class="unlocks">
		<h2>Unlocks</h2>
		<Unlocks></Unlocks>
	</div>
	
	<div class="achievements">
		<h2>Achievements</h2>
		<Achievements></Achievements>
	</div>
</div>

<style lang="scss">
	.container {
		p, h2 {
			text-align: center;
		}
		h2{
			margin-top: 2rem;
		}
		.current{
			span{
				cursor: pointer;
				text-decoration: underline;
			}
		}
	}
</style>
