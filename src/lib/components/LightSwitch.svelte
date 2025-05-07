<script lang="ts">
  import { Switch } from "@skeletonlabs/skeleton-svelte";

  // Icons
  import IconMoon from "@lucide/svelte/icons/moon";
  import IconSun from "@lucide/svelte/icons/sun";

  let checked = $state(false);

  $effect(() => {
    const mode = localStorage.getItem("mode") || "light";
    checked = mode === "dark";
  });

  const onCheckedChange = (event: { checked: boolean }) => {
    const mode = event.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("mode", mode);
    checked = event.checked;
  };

  // Bind to the checked state
  let mode = $state(false);

  // Handle the change in state when toggled.
  function handleModeChange(checked: boolean) {
    // NOTE: implementation may differ per Tailwind config and framework:
    // https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
    console.log({ mode });
    mode = checked;
  }
</script>

<svelte:head>
  <script>
    const mode = localStorage.getItem("mode") || "dark";
    document.documentElement.setAttribute("data-mode", mode);
  </script>
</svelte:head>

<Switch name="mode" controlActive="bg-surface-200" {checked} {onCheckedChange}>
  {#snippet inactiveChild()}<IconMoon size="14" />{/snippet}
  {#snippet activeChild()}<IconSun size="14" />{/snippet}
</Switch>
