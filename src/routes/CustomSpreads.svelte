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
        img: "/options/custom.png",
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
      img: "/options/Add.png",
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
  selectItem($customSpreadsStore.length);

</script>

<div class="container">

  {#if (unlocks.get("custom")?.exp || 10000) <= $page.data.profile.data.experience}

  <ItemList items={listItems} />

  <div class="newSpread">
    <label class="" for="spreadName">Spread Name: </label>
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
          }}>Delete Card</button>
      </div>
    {/each}
    <div class="addCard">
      <button class="add" on:click={() => addNewCard()}>+ Add Card</button>
    </div>

    <button class="save" on:click={() => saveSpread()}>Save Spread</button>
    <!-- Delete -->
    {#if selected !== $customSpreadsStore.length}
      <button class="delete" on:click={() => deleteSpread()}>Delete Spread</button>
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
    width: 35rem;
    max-width: 90vw;
    .card, .add, .save, .delete{
      margin-top: 1rem;
    }
    .delete{
      margin-left: 0.5rem;
    }
    button{
      cursor: pointer;
		  background-color: $accent;
		  border: none;
		  padding: 0.25rem 0.5rem;
		  font-family: $other-font;
		  font-weight: 700;
    }
  }
</style>