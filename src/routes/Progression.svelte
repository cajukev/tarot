<script lang="ts">
	import { unlocks, type Unlock } from '$lib/unlocks';
	import { page } from '$app/stores';
	import { menuStateStore } from '../stores';
	let unlocksArray = Array.from(unlocks.entries());
</script>

<div class="container">
	<p class="current">Current experience: {$page.data.profile.data.experience}<br>Gain experience by completing <span
		tabindex="0"
		on:click={() => $menuStateStore = {value: 3, change: true}} 
		on:keydown={(e) => {if (e.key === 'Enter') $menuStateStore = {value: 3, change: true}}}
		>achievements</span></p>
	<div class="unlocks">
		{#each unlocksArray as unlock}
			<div
				class={'unlock ' + (unlock[1].exp <= $page.data.profile.data.experience ? 'completed' : '')}
			>
				<p class="category">
					{#if unlock[1].type === 'card'}
						Card deck
					{/if}
					{#if unlock[1].type === 'scenario'}
						Scenario
					{/if}
					{#if unlock[1].type === 'reader'}
						Reader
					{/if}
				</p>
				
				<div class={'imgContainer ' + unlock[1].type}>
					{#if unlock[1].exp <= $page.data.profile.data.experience}
						<img class="check" src="check.svg" alt="achievement completed" />
					{:else}
						{#if unlock[1].type === 'card'}
							<img src={'/cards/Ace_of_' + unlock[0] + '-120.webp'} alt={unlock[1].name} />
						{/if}
						{#if unlock[1].type === 'scenario'}
							<img src={'/options/' + unlock[0] + '.png'} alt={unlock[1].name} />
						{/if}
						{#if unlock[1].type === 'reader'}
							<img src={'/options/' + unlock[0] + '-200.webp'} alt={unlock[1].name} />
						{/if}
					{/if}
				</div>
        <p class="name">
					{unlock[1].name}
				</p>
        {#if unlock[1].exp > $page.data.profile.data.experience}
				<p class="exp">
					Unlocks at {unlock[1].exp} exp
				</p>
        {/if}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.container {
		p {
			text-align: center;
		}
		.current{
			margin-bottom: 1rem;
			span{
				cursor: pointer;
				text-decoration: underline;
			}
		}
		.unlocks {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 1rem;
			.unlock {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				width: 10rem;
				background: $bg;
				border-radius: 0.5rem;
				padding: 1rem;
				&.completed {
					opacity: 0.65;
					&:hover {
						opacity: 1;
					}
				}
        .category{
          font-family: $header-font;
        }
        .name{
          margin-bottom: 1rem;
        }
        .exp{
          font-size: $mini-font-size
        }
				.imgContainer {
					width: 6rem;
					height: 6rem;
					margin: 1rem;
					img {
						width: 100%;
						height: 100%;
						object-fit: contain;
						background: $bg2;
						border: 3px solid $bg2;
						border-radius: 0.5rem;
						&.check {
							padding: 1rem;
						}
					}
					&.reader {
						border-radius: 0.5rem;
						overflow: hidden;
					}
				}
			}
			> p {
				width: 100%;
				text-align: center;
			}
		}
	}
</style>
