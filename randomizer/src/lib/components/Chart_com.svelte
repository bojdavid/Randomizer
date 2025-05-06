<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let { selectedCount, unselectedCount } = $props();

  console.log(selectedCount);

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const xValues: string[] = ["Selected", "Unselected"];
    let yValues: number[] = [selectedCount, unselectedCount];
    const barColors: string[] = ["#b91d47", "#00aba9"];

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
      options: {},
    });
  });
</script>

<div class="h-64 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
