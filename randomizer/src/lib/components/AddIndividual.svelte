<script lang="ts">
  let { addIndividual, name = $bindable("") } = $props();
</script>

<div class="max-w-lg w-full min-w-sm">
  <form action="">
    <div>
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        placeholder="Enter Name of Individual"
        bind:value={name}
      />
    </div>

    <div class="flex justify-between mt-5">
      <button
        type="button"
        class="btn preset-filled-primary-500"
        onclick={addIndividual}
      >
        Add Individual
      </button>

      <button type="button" class="btn preset-filled-primary-500">
        Upload CSV
      </button>
    </div>
  </form>
</div>
