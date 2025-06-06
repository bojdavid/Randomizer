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
            borderWidth: 0,
            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "top", // place legend at the top
            align: "start",
            labels: {
              boxWidth: 10, // Width of the colored box
              boxHeight: 10,
              font: {
                size: 10, // Change this to reduce/increase label font size
              },
            },
          },
        },
      },
    });
  });
</script>

<div
  class="{unselectedCount == 0 ? 'hidden' : 'sm:h-60 w-full h-30'} align-left"
>
  <canvas bind:this={canvas}></canvas>
</div>
