<script lang="ts">
  import "../lib/styles/app.css";
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import { Modal } from "@skeletonlabs/skeleton-svelte";

  import AddIndividual from "$lib/components/AddIndividual.svelte";
  import { Stethoscope } from "@lucide/svelte";

  let openState = $state(false);

  function modalClose() {
    openState = false;
  }

  interface Person {
    id: number;
    name: string;
    selected: boolean;
  }

  let data: Person[] = $state([
    { id: 1, name: "Alice", selected: false },
    { id: 2, name: "Bob", selected: false },
    { id: 3, name: "Charlie", selected: true },
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
    { id: 14, name: "Nina", selected: true },
    { id: 15, name: "Oscar", selected: false },
    { id: 16, name: "Paula", selected: false },
    { id: 17, name: "Quinn", selected: true },
    { id: 18, name: "Ryan", selected: false },
    { id: 19, name: "Sophie", selected: true },
    { id: 20, name: "Tom", selected: false },
  ]);

  let name: string = $state("");
  let newPerson: Person;

  const addIndividual = (): void => {
    newPerson = { name: name, selected: false, id: data.length + 1 };
    data.push(newPerson);
    modalClose();
  };

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
              py-4
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
          <AddIndividual {addIndividual} bind:name />
        {/snippet}
      </Modal>
    </header>
    <!--    PIE CHART AND NEWLY SELECTED SECTION -->
    <section class="flex justify-between flex-wrap mt-10">
      <div
        class="rounded-full w-[200px] h-[200px]
          bg-surface-800 flex flex-col justify-center mx-auto"
      >
        <h2 class="text-2xl font-bold text-surface-500 text-center">
          Pie chart place holder
        </h2>
      </div>

      <div class="w-sm mt-10 sm:mt-0">
        <h1 class="text-xl font-bold">Current Selection</h1>
        {#each data as person, index}
          {#if person.selected}
            <div class="placeholder animate-pulse mt-1 text-lg text-center">
              {index}
            </div>
          {/if}
        {/each}
      </div>
    </section>
    <!-- END OF PIE CHART SECTION -->
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
        {#if active_filter == "Selected"}
          {#each data as person}
            {#if person.selected}
              <div>
                <h1 class="text-lg font-bold">{person.name}</h1>
              </div>
            {/if}
          {/each}
        {:else if active_filter == "Unelected"}
          {#each data as person}
            {#if person.selected}
              <div>
                <h1 class="text-lg font-bold">{person.name}</h1>
              </div>
            {/if}
          {/each}
        {:else}
          {#each data as person}
            <div>
              <h1 class="text-lg font-bold">{person.name}</h1>
            </div>
          {/each}
        {/if}
      </div>
    </section>
  </div>
</main>
