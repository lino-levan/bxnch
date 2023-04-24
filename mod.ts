// deno-lint-ignore-file no-explicit-any
import { serve } from "std/http/server.ts";
import { renderChart } from "fresh_charts/render.ts";
import { ChartColors } from "fresh_charts/utils.ts";

export function toRawFileUrl(url: URL) {
  return url.toString().replace(
    url.origin,
    "https://raw.githubusercontent.com",
  );
}

export async function handler(request: Request) {
  if (request.method !== "GET") {
    await request.body?.cancel();
    return new Response(null, { status: 404 });
  }

  const url = new URL(request.url);
  if (url.pathname === "/") {
    return Response.redirect("https://github.com/iuioiua/bnch");
  }

  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: 404 });
  }

  const response = await fetch(toRawFileUrl(url));
  const bench = await response.json();

  return await renderChart({
    data: {
      labels: bench.benches.map(({ name }: any) => name),
      datasets: [{
        label: "Iterations / second",
        data: bench.benches.map(({ results }: any) => results[0].ok.avg),
        backgroundColor: url.searchParams.get("color") ?? ChartColors.Green,
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
  });
}

async function main() {
  await serve(handler);
}

if (import.meta.main) {
  await main();
}
