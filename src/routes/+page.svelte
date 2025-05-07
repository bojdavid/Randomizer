<script lang="ts">
  import "../lib/styles/app.css";
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import { Modal } from "@skeletonlabs/skeleton-svelte";
  import { fly } from "svelte/transition";

  import AddIndividual from "$lib/components/AddIndividual.svelte";
  import Chart_com from "$lib/components/Chart_com.svelte";
  import FilterTabs from "$lib/components/FilterTabs.svelte";

  import {
    downloadCSV,
    getDistinctGroups,
    assignNewDistinctGroup,
    resetSelection,
  } from "./func.svelte";

  //MODAL FUNCTIONS FROM SKELETON UI
  let openState = $state(false);

  function modalClose() {
    openState = false;
  }

  // INTERFACE FOR PERSON OBJECT
  interface Person {
    id: number;
    name: string;
    selected: boolean;
    group?: string;
  }

  // SAMPLE DATA, LIST OF RANDOMLY GENERATED PERSONS

  let peopleData: Person[] = $state([]);

  //let data: Person[] = $state([]);

  let name: string = $state("");
  let newPerson: Person;

  let newlySelected: Person[] = $state([]);
  let numFreshSelection: number = $state(0);

  let selectedCount = $derived(
    peopleData.filter((item) => item.selected).length
  );
  let unselectedCount = $derived(peopleData.length - selectedCount);

  let groups: string[] = $state([]);

  // FUNCTION TO ADD A NEW INDIVIDUAL TO THE DATA
  const addIndividual = (): void => {
    newPerson = {
      name: name,
      selected: false,
      id: peopleData.length + 1,
      group: "No group",
    };
    peopleData.push(newPerson);
    name = "";
    modalClose();
  };

  // FUNCTION TO ADD MULTIPLE INDIVIDUALS VIA CSV FILE.
  const addIndividuals = (individuals: any): void => {
    peopleData = individuals;
    groups = getDistinctGroups(peopleData);
    console.log($state.snapshot(groups));
  };

  function selectRandomPeople(count: number): void {
    let groupForSelection = assignNewDistinctGroup(groups); // Group of the current selection

    // Filter unselected people
    const unselected = peopleData.filter((p) => !p.selected);

    if (unselected.length === 0) {
      // Reset selection if all have been selected
      resetSelection(peopleData, groups);
      return selectRandomPeople(count); // Try again after resetting
    }
    // SELECT THE SMALLER VALUE IF THE LENGTH OF UNSELECTED IS LESS THAN COUNT(no of people to select)
    const numToSelect = Math.min(count, unselected.length);

    // Randomly select without replacement
    const selected: Person[] = [];
    while (selected.length < numToSelect) {
      const randomIndex = Math.floor(Math.random() * unselected.length);
      const person = unselected.splice(randomIndex, 1)[0];
      person.selected = true;
      person.group = groupForSelection;

      //Add a group to the person.

      selected.push(person);
    }

    newlySelected = selected;
  }

  //FILTER FUNCTION
  const filter_Tabs: string[] = ["All", "Selected", "Unselected"];
  let active_filter = $state("All");

  const changeActiveFilter = (filter: string): void => {
    active_filter = filter;
  };
</script>

<main class="">
  <div class="mx-auto max-w-2xl w-full min-w-sm">
    <header
      class=" flex justify-between items-center
              py-4 px-3 w-full
              bg-surface-100 dark:bg-surface-900"
    >
      <h1 class="md:text-4xl text-3xl font-bold">Randomizer</h1>

      <div class="flex flex-col gap-3 items-center">
        <LightSwitch />
        <Modal
          open={openState}
          onOpenChange={(e) => (openState = e.open)}
          triggerBase="btn preset-filled-primary-500"
          contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-2xl w-full min-w-xs"
          backdropClasses="backdrop-blur-sm"
        >
          {#snippet trigger()}
            Add Individual
          {/snippet}
          {#snippet content()}
            <AddIndividual
              {addIndividual}
              bind:name
              {addIndividuals}
              {modalClose}
            />
          {/snippet}
        </Modal>
      </div>
    </header>
    <!--    PIE CHART AND NEWLY SELECTED SECTION -->
    <section class="flex justify-between mt-10">
      {#key unselectedCount}
        <div class="">
          <Chart_com {selectedCount} {unselectedCount} />
        </div>
      {/key}

      <div class="max-w-sm w-full min-w-[50px] mt-10 sm:mt-0">
        <div class="table-wrap">
          <table class="table caption-bottom">
            <caption class="pt-4"
              >List of all Newly Selected Individuals</caption
            >
            <thead>
              <tr class="font-">
                <th>ID</th>
                <th>Name</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#each newlySelected as person}
                {#if person.selected}
                  <tr>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td>{person.group}</td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <!-- END OF PIE CHART AND NEWLY SECTION -->

    <!-- RANDOM SELECTION SECTION-->
    <section class="mt-10 flex justify-center gap-4 flex-wrap">
      <button
        type="button"
        class="btn preset-filled-primary-500"
        onclick={() => selectRandomPeople(numFreshSelection)}
      >
        Randomly Select
      </button>

      <input
        type="number"
        placeholder="No to select"
        bind:value={numFreshSelection}
        class="w-[100px] p-1 border border-secondary-500 rounded-lg"
      />

      <button
        class="btn preset-filled-success-500"
        onclick={() => downloadCSV(peopleData, "data.csv")}
      >
        Download Csv File
      </button>

      <button
        class="btn preset-filled-warning-500"
        onclick={() => resetSelection(peopleData, groups)}
      >
        Reset Selection
      </button>
    </section>
    <!-- END OF RANDOM SELECTION -->

    <!-- TABLE SECTION-->
    <section class="mt-10">
      <FilterTabs {changeActiveFilter} {filter_Tabs} {active_filter} />
      <div>
        <div class="table-wrap">
          <table class="table caption-bottom">
            <caption class="pt-4"
              >List of all {active_filter} Individuals</caption
            >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#if active_filter == "Selected"}
                {#each peopleData as person}
                  {#if person.selected}
                    <tr in:fly={{ x: 200 }} out:fly={{ x: -200 }}>
                      <td>{person.id}</td>
                      <td>{person.name}</td>
                      <td>{person.group}</td>
                    </tr>
                  {/if}
                {/each}
              {:else if active_filter == "Unselected"}
                {#each peopleData as person}
                  {#if !person.selected}
                    <tr in:fly={{ y: 200 }} out:fly={{ y: -200 }}>
                      <td>{person.id}</td>
                      <td>{person.name}</td>
                      <td>{person.group}</td>
                    </tr>
                  {/if}
                {/each}
              {:else}
                {#each peopleData as person}
                  <tr class={person.selected ? "bg-secondary-500" : ""}>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td>{person.group}</td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</main>
