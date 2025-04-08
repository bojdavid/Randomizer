<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  const xValues: string[] = ["Selected", "Unselected"];
  const yValues: number[] = [10, 34];
  const barColors: string[] = ["#b91d47", "#00aba9"];

  onMount(() => {
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
