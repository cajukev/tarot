<script lang="ts">
  import type { ReadingScenarioType } from "$lib/readingScenarios";
  import { customScenariosStore } from "../stores";
  import { page } from "$app/stores";
  import { unlocks } from "$lib/unlocks";
	import { get } from "svelte/store";
	import { invalidateAll } from "$app/navigation";
  $:console.log($page.data.profile.data.custom_scenarios)
  let newScenario: ReadingScenarioType = {
    name: "New Scenario",
    positions: [],
    instructions: [],
  };
  console.log(newScenario);

  let addNewCard = () => {
    newScenario.positions.push("");
    newScenario = { ...newScenario };
  };

  let saveScenario = () => {
    customScenariosStore.update((scenarios) => {
      scenarios.push(newScenario);
      return scenarios;
    });
    fetch("/api/updateCustomScenarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customScenarios: $customScenariosStore
      }
      ),
    })
    .then(() => {
      invalidateAll();
    })
  };
</script>

<div class="container">


  <!-- {#each $page.data.profile.data.custom_scenarios as scenario}
    <div class="card">
      <h2>{scenario.name}</h2>
      <p>{scenario.positions.join(", ")}</p>
    </div>
  {/each} -->

  {#if (unlocks.get("custom")?.exp || 10000) < $page.data.profile.data.experience}

  <div class="">
    <label for="scenarioName">Scenario Name: </label>
    <input type="text" id="scenarioName" bind:value={newScenario.name} />
    {#each newScenario.positions as position, i }
      <div class="card">
        <label for="positionName">Position Name: </label>
        <input type="text" id="positionName" bind:value={newScenario.positions[i]} />
        <label for="positionInstruction">Instruction: </label>
        <input type="text" id="positionInstruction" bind:value={newScenario.instructions[i]} />
        <!-- Delete this card -->
        <button on:click={() => {
          newScenario.positions.splice(i, 1); 
          newScenario = { ...newScenario }
          }}>Delete</button>
      </div>
    {/each}
    <div class="addCard">
      <button on:click={() => addNewCard()}>+ Add Card</button>
    </div>

    <button on:click={() => saveScenario()}>Submit</button>
  </div>
  {:else}
    <p>Custom scenarios are unlocked at {unlocks.get("custom")?.exp} experience.</p>
  {/if}
</div>