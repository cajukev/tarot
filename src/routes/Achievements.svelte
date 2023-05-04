<script lang="ts">
  import { type Achievement, achievements, achievementsOrder } from "$lib/achievements";
  import { page } from "$app/stores";
  import { objToMap } from "$lib/utils";
	import ItemList from "./ItemList.svelte";
  let achievementsArray: Achievement[] = Array.from((objToMap($page.data.profile.data.achievements) || achievements).values()) ;
  console.log("achievementsArray", achievementsArray);
  // AchievementsOrder is an array of achievement IDs in the order they should be displayed
  achievementsArray.sort((a, b) => achievementsOrder.indexOf(a.name) - achievementsOrder.indexOf(b.name));

  let listItems: ListItem[] = [];

  let setupItemList = () => {
    listItems = [];
    for (let i = 0; i < achievementsArray.length; i++) {
      listItems.push({
        id: i,
        name: achievementsArray[i].name,
        img: achievementsArray[i].completed ? "check.svg" : "50XP.svg",
        selected: false,
        description: achievementsArray[i].description,
        completed: achievementsArray[i].completed,
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