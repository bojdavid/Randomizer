<script lang="ts">
  let { addIndividual, name = $bindable(""), addIndividuals } = $props();

  let fileInput_: any = $state();

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

    if (idIndex === -1 || nameIndex === -1) {
      console.warn("ID or Name column not found.");
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
      };
    });

    return result;
  }

  const readFile = () => {
    const file = fileInput_.files[0];

    // Modern, promise-based way to read text content
    file
      .text()
      .then((text: string) => {
        //console.log("CSV file content:\n", text);
        let data = extractNameAndId(text, "director", "show_id");
        console.log(data.slice(0, 30));
        addIndividuals(data.slice(0, 30));
        // You can now parse the CSV or do something with the text
      })
      .catch((error: Error) => {
        console.error("Error reading file:", error);
      });
  };
</script>

<div class="max-w-xl w-full min-w-sm">
  <form action="">
    <div class="flex justify-between gap-20">
      <!-- Manually Input names-->
      <div>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" placeholder="Enter Name of Individual" />
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

      <!-- Use Csv FIle-->
      <div class="text-center">
        {#key fileInput_}
          <p>
            {#if fileInput_ == null}
              You haven't seleted a file
            {:else}
              {fileInput_.files[0].name}
            {/if}
          </p>
        {/key}

        <label for="csvFile" class="btn preset-filled-primary-500"
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
        <button type="submit" onclick={readFile}> Use File </button>
      </div>
    </div>
  </form>

  <pre id="output"></pre>
</div>
