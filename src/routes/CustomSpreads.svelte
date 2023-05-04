<script lang="ts">
  import type { ReadingSpreadType } from "$lib/readingSpreads";
  import { customSpreadsStore } from "../stores";
  import { page } from "$app/stores";
  import { unlocks } from "$lib/unlocks";
	import { get } from "svelte/store";
	import { invalidateAll } from "$app/navigation";
	import ItemList from "./ItemList.svelte";
  $:console.log($page.data.profile.data.custom_spreads)
  let newSpread: ReadingSpreadType = {
    name: "New Spread",
    positions: [],
    instructions: [],
  };
  console.log(newSpread);

  let addNewCard = () => {
    newSpread.positions.push("");
    newSpread = { ...newSpread };
  };

  let saveSpread = () => {
    customSpreadsStore.update((spreads) => {
      if(selected === spreads.length){
        spreads.push(newSpread);
      } 
      else {
        spreads[selected] = newSpread;
      }
      return spreads;
    });
    fetch("/api/updateCustomSpreads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customSpreads: $customSpreadsStore
      }
      ),
    })
    .then(() => {
      invalidateAll();
      setupItemList();
    })
  };

  let updateSpread = () => {
    customSpreadsStore.update((spreads) => {
      spreads[selected] = newSpread;
      return spreads;
    });
    fetch("/api/updateCustomSpreads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customSpreads: $customSpreadsStore
      }
      ),
    })
    .then(() => {
      invalidateAll();
      setupItemList();
    })
  };


  let deleteSpread = () => {
    customSpreadsStore.update((spreads) => {
      spreads.splice(selected, 1);
      return spreads;
    });
    fetch("/api/updateCustomSpreads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customSpreads: $customSpreadsStore
      }
      ),
    })
    .then(() => {
      invalidateAll();
      setupItemList();
    })
  };

  // List of custom spreads form customSpreadsStore

  let listItems: ListItem[] = [];
  let selected = -1;

  let setupItemList = () => {
    listItems = [];
    for (let i = 0; i < $customSpreadsStore.length; i++) {
      listItems.push({
        name: $customSpreadsStore[i].name,
        description: $customSpreadsStore[i].positions.join(", "),
        id: i,
        img: "",
        selected: i === selected,
        action() {
          selectItem(i);
        },
      });
    }
    // Add a new spread button
    listItems.push({
      name: "Create a new spread",
      id: $customSpreadsStore.length,
      img: "",
      selected: $customSpreadsStore.length === selected,
      action() {
        selectItem($customSpreadsStore.length);
      },
    });
  };
  setupItemList();

  let selectItem = (id: number) => {
    if (selected === id) {
      return;
    } else {
      selected = id;
      newSpread = $customSpreadsStore[id] || {
        name: "New Spread",
        positions: [],
        instructions: [],
      };
      setupItemList();
    }
  };

</script>

<div class="container">


  <!-- {#each $page.data.profile.data.custom_spreads as spread}
    <div class="card">
      <h2>{spread.name}</h2>
      <p>{spread.positions.join(", ")}</p>
    </div>
  {/each} -->

  {#if (unlocks.get("custom")?.exp || 10000) <= $page.data.profile.data.experience}

  <ItemList items={listItems} />

  <div class="newSpread">
    <label for="spreadName">Spread Name: </label>
    <input type="text" id="spreadName" bind:value={newSpread.name} />
    {#each newSpread.positions as position, i }
      <div class="card">
        <label for="positionName">Position Name: </label>
        <input type="text" id="positionName" bind:value={newSpread.positions[i]} />
        <label for="positionInstruction">Instruction: </label>
        <input type="text" id="positionInstruction" bind:value={newSpread.instructions[i]} />
        <!-- Delete this card -->
        <button on:click={() => {
          newSpread.positions.splice(i, 1); 
          newSpread = { ...newSpread }
          }}>Delete</button>
      </div>
    {/each}
    <div class="addCard">
      <button on:click={() => addNewCard()}>+ Add Card</button>
    </div>

    <button on:click={() => saveSpread()}>Submit</button>
    <!-- Delete -->
    {#if selected !== $customSpreadsStore.length}
      <button on:click={() => deleteSpread()}>Delete</button>
    {/if}
  </div>
  {:else}
    <p>Custom spreads are unlocked at {unlocks.get("custom")?.exp} experience.</p>
  {/if}
</div>

<style lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .newSpread{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
</style>