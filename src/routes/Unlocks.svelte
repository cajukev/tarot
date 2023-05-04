<script lang="ts">
	import { unlocks, type Unlock } from '$lib/unlocks';
	import { page } from '$app/stores';
	import { menuStateStore } from '../stores';
	import Achievements from './Achievements.svelte';
	import ItemList from './ItemList.svelte';
	let unlocksArray = Array.from(unlocks.entries());


  let listItems: ListItem[] = [];

  let setupItemList = () => {
    listItems = [];
    for (let i = 0; i < unlocksArray.length; i++) {
			let img = '';
			if(unlocksArray[i][1].type === 'card'){
				img = '/cards/Ace_of_' + unlocksArray[i][0] + '-120.webp';
			}
			if(unlocksArray[i][1].type === 'spread'){
				img = '/options/' + unlocksArray[i][0] + '.png';
			}
			if(unlocksArray[i][1].type === 'reader'){
				img = '/options/' + unlocksArray[i][0] + '-200.webp';
			}
      listItems.push({
        id: i,
        name: unlocksArray[i][1].name,
        img: img,
				exp: unlocksArray[i][1].exp,
				selected: false,
				completed: unlocksArray[i][1].exp > $page.data.profile.data.experience
      });
    }
  };
  setupItemList();
	

</script>

<div class="container">
  <ItemList items={listItems} />
</div>

<style lang="scss">
	.container{
		width: fit-content;
    margin: auto;
	}
</style>
