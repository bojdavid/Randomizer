<script>
  let { filter_Tabs, changeActiveFilter, active_filter } = $props();
</script>

<header class="flex justify-evenly">
  {#each filter_Tabs as filter}
    <button
      class="text-lg font-bold text-primary-500
                      dark:hover:text-primary-700 hover:text-primary-300
                      transition duration-400 ease-in-out {active_filter ==
      filter
        ? 'border-b-2'
        : ''}"
      onclick={() => changeActiveFilter(filter)}
    >
      {filter}
    </button>
  {/each}
</header>
