import { serve } from "std/http/server.ts";
import { renderChart } from "fresh_charts/render.ts";
import { ChartColors } from "fresh_charts/utils.ts";
import bench from "./bench.json" assert { type: "json" };

async function main() {
  await serve((_req) =>
    renderChart({
      data: {
        labels: bench.benches.map(({ name }) => name),
        datasets: [{
          label: "Iterations",
          data: bench.benches.map(({ results }) => results[0].ok.avg),
          backgroundColor: ChartColors.Green,
        }],
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: "Iterations",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `${bench.cpu} ${bench.runtime}`,
          },
        },
      },
    })
  );
}

if (import.meta.main) {
  await main();
}
