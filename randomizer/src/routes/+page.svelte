<script lang="ts">
  import "../lib/styles/app.css";
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import { Modal } from "@skeletonlabs/skeleton-svelte";

  import AddIndividual from "$lib/components/AddIndividual.svelte";
  import Chart_com from "$lib/components/Chart_com.svelte";

  import { downloadCSV } from "./func.svelte";

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
  }

  // SAMPLE DATA, LIST OF RANDOMLY GENERATED PERSONS

  let peopleData: Person[] = $state([
    { id: 1, name: "Alice", selected: false },
    { id: 2, name: "Bob", selected: false },
    { id: 3, name: "Charlie", selected: false },
    { id: 4, name: "Diana", selected: false },
    { id: 5, name: "Ethan", selected: false },
    { id: 6, name: "Fiona", selected: false },
    { id: 7, name: "George", selected: false },
    { id: 8, name: "Hannah", selected: false },
    { id: 9, name: "Ian", selected: false },
    { id: 10, name: "Jasmine", selected: false },
    { id: 11, name: "Kyle", selected: false },
    { id: 12, name: "Luna", selected: false },
    { id: 13, name: "Mason", selected: false },
    { id: 14, name: "Nina", selected: false },
    { id: 15, name: "Oscar", selected: false },
    { id: 16, name: "Paula", selected: false },
    { id: 17, name: "Quinn", selected: false },
    { id: 18, name: "Ryan", selected: false },
    { id: 19, name: "Sophie", selected: false },
    { id: 20, name: "Tom", selected: false },
  ]);

  //let data: Person[] = $state([]);

  let name: string = $state("");
  let newPerson: Person;

  let newlySelected: Person[] = $state([]);
  let numFreshSelection: number = $state(0);

  // FUNCTION TO ADD A NEW INDIVIDUAL TO THE DATA
  const addIndividual = (): void => {
    newPerson = { name: name, selected: false, id: peopleData.length + 1 };
    peopleData.push(newPerson);
    modalClose();
  };

  // FUNCTION TO ADD MULTIPLE INDIVIDUALS VIA CSV FILE.
  const addIndividuals = (individuals: any): void => {
    peopleData = individuals;
  };

  function selectRandomPeople(count: number): void {
    // Filter unselected people
    const unselected = peopleData.filter((p) => !p.selected);

    if (unselected.length === 0) {
      // Reset selection if all have been selected
      peopleData.forEach((p) => (p.selected = false));
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

<main class="mx-5">
  <LightSwitch />
  <div class="mx-auto max-w-2xl w-full min-w-sm">
    <header
      class=" flex justify-between items-center
              py-4 px-3
              bg-surface-100 dark:bg-surface-900"
    >
      <h1 class="text-4xl font-bold">Randomizer</h1>
      <Modal
        open={openState}
        onOpenChange={(e) => (openState = e.open)}
        triggerBase="btn preset-filled-primary-500"
        contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
        backdropClasses="backdrop-blur-sm"
      >
        {#snippet trigger()}
          Add Individual
        {/snippet}
        {#snippet content()}
          <AddIndividual {addIndividual} bind:name {addIndividuals} />
        {/snippet}
      </Modal>
    </header>
    <!--    PIE CHART AND NEWLY SELECTED SECTION -->
    <section class="flex justify-between flex-wrap mt-10">
      <div class="">
        <Chart_com />
      </div>

      <div class="w-xs mt-10 sm:mt-0">
        <div class="table-wrap">
          <table class="table caption-bottom">
            <caption class="pt-4"
              >List of all Newly Selected Individuals</caption
            >
            <thead>
              <tr class="font-">
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#each newlySelected as person}
                {#if person.selected}
                  <tr>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
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
    <section class="mt-10 flex justify-center gap-4">
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
        class="btn preset-filled-primary-500"
        onclick={() => downloadCSV(peopleData)}
      >
        Download Csv File
      </button>
    </section>
    <!-- END OF RANDOM SELECTION -->

    <!-- TABLE SECTION-->
    <section class="mt-10">
      <header class="flex justify-evenly">
        {#each filter_Tabs as filter}
          <button
            class="text-lg font-bold text-primary-500
                          dark:hover:text-primary-700 hover:text-primary-300
                          transition duration-400 ease-in-out"
            onclick={() => changeActiveFilter(filter)}
          >
            {filter}
          </button>
        {/each}
      </header>
      <div>
        <div class="table-wrap">
          <table class="table caption-bottom">
            <caption class="pt-4"
              >List of all {active_filter} Individuals</caption
            >
            <thead>
              <tr class="font-">
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#if active_filter == "Selected"}
                {#each peopleData as person}
                  {#if person.selected}
                    <tr>
                      <td>{person.id}</td>
                      <td>{person.name}</td>
                    </tr>
                  {/if}
                {/each}
              {:else if active_filter == "Unselected"}
                {#each peopleData as person}
                  {#if !person.selected}
                    <tr>
                      <td>{person.id}</td>
                      <td>{person.name}</td>
                    </tr>
                  {/if}
                {/each}
              {:else}
                {#each peopleData as person}
                  <tr class={person.selected ? "bg-secondary-500" : ""}>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
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
