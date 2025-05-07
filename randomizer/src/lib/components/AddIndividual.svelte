<script lang="ts">
  import FilterTabs from "./FilterTabs.svelte";

  let {
    addIndividual,
    name = $bindable(),
    addIndividuals,
    modalClose,
  } = $props();

  let fileInput_: any = $state();

  let idColumn: string = $state("show_id"); //What the id Column is called
  let nameColumn: string = $state("director"); // what the name column is called

  const getFile = async () => {
    fileInput_ = document.getElementById("csvFile");
  };

  function extractNameAndId(csvText: any, name: string, id: string) {
    const lines = csvText.trim().split("\n");

    // Split the header to find column indices
    const headers = lines[0].split(",").map((h: any) => h.trim().toLowerCase());

    const idIndex = headers.indexOf(id.toLowerCase());
    const nameIndex = headers.indexOf(name.toLowerCase());
    const selectedIndex = headers.indexOf("selected");
    const groupIndex = headers.indexOf("groups");

    if (idIndex === -1 || nameIndex === -1) {
      console.warn("ID or Name column not found.");
      alert(`Name Column: ${nameColumn} or ID column ${idColumn} is incorrect`);
      return [];
    }

    // Map remaining rows to objects with name, id, and selected
    const result = lines.slice(1).map((line: any) => {
      const fields = line.split(",");

      return {
        id: fields[idIndex]?.trim(),
        name: fields[nameIndex]?.trim(),
        selected:
          selectedIndex !== -1
            ? fields[selectedIndex]?.trim().toLowerCase() === "true"
            : false,
        group:
          groupIndex !== -1
            ? fields[selectedIndex]?.trim().toLowerCase() === "true"
            : "No group",
      };
    });

    modalClose();
    return result;
  }

  const readFile = () => {
    const file = fileInput_.files[0];

    // Modern, promise-based way to read text content
    file
      .text()
      .then((text: string) => {
        //console.log("CSV file content:\n", text);
        let data = extractNameAndId(text, nameColumn, idColumn);
        console.log(data.slice(0, 30));
        addIndividuals(data.slice(0, 30));
        // You can now parse the CSV or do something with the text
      })
      .catch((error: Error) => {
        console.error("Error reading file:", error);
      });
  };

  //FILTER FUNCTION
  const filter_Tabs: string[] = ["Upload File", "Manually Input Data"];
  let active_filter = $state(filter_Tabs[1]);

  const changeActiveFilter = (filter: string): void => {
    active_filter = filter;
  };
</script>

<!--
  Code Snippets Section
-->

{#snippet fieldNameInputs()}
  <div class="flex flex-row justify-between gap-5 text-left">
    <div class="flex flex-col">
      <label for="idColumn" class="text-xs"> ID field</label>
      <input
        type="text"
        bind:value={idColumn}
        placeholder="Enter field name of the ID column"
        id="idColumn"
        class="border-2 border-primary-500 max-w-xs min-w-auto w-full p-1 text-lg text-surface-600 dark:text-surface-300 rounded-lg"
      />
    </div>
    <div class="flex-col flex">
      <label for="nameColumn" class="text-xs"> Name field</label>
      <input
        type="text"
        bind:value={nameColumn}
        placeholder="Enter field name of the Names column"
        id="nameColumn"
        class="border-2 border-primary-500 max-w-xs min-w-auto w-full w-2xs p-1 text-lg text-surface-600 dark:text-surface-300 rounded-lg"
      />
    </div>
  </div>
{/snippet}

<!-- End of Code Snippets-->

<div class="w-full">
  <form action="">
    <div class="mb-7">
      <FilterTabs {changeActiveFilter} {filter_Tabs} {active_filter} />
    </div>
    <div class="flex justify-center">
      {#if active_filter == filter_Tabs[1]}
        <!-- Manually Input names-->
        <div>
          <div class="flex flex-col text-md">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name of Individual"
              class="w-md border-2 p-2 rounded-xl my-4"
              bind:value={name}
            />
          </div>

          <div class="flex justify-between mt-5">
            <button
              type="button"
              class="btn preset-filled-primary-500 h-10 mx-auto"
              onclick={addIndividual}
            >
              Add Individual
            </button>
          </div>
        </div>
      {:else if active_filter == filter_Tabs[0]}
        <!-- Use Csv FIle-->
        <div class="text-center">
          {#key fileInput_}
            {#if fileInput_ == null}
              <p class="text-lg dark:text-warning-400 text-warning-600 mb-4">
                You haven't seleted a file
              </p>
              {@render fieldNameInputs()}
            {:else}
              <p class="text-lg text-surface-300 dark:tetxt-surface-700">
                File Name:
                <span class="text-success-700 dark:text-success-400">
                  {fileInput_.files[0].name}
                </span>
              </p>

              {@render fieldNameInputs()}
            {/if}
          {/key}

          <label for="csvFile" class="btn preset-filled-primary-500 my-6"
            >Choose CSV file</label
          >
          <input
            type="file"
            id="csvFile"
            name="csvFile"
            accept=".csv"
            class="hidden"
            onchange={getFile}
          />
          <br />
          {#key fileInput_}
            {#if fileInput_ == null}
              <p></p>
            {:else}
              <button
                type="submit"
                onclick={readFile}
                class="btn preset-filled-primary-500"
              >
                Use File
              </button>
            {/if}
          {/key}
        </div>
      {/if}
    </div>
  </form>

  <pre id="output"></pre>
</div>
