<script lang="ts">
  import type { ReadingScenarioType } from "$lib/readingScenarios";
  import { customScenariosStore } from "../stores";
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
  };
</script>

<div class="container">
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
</div>