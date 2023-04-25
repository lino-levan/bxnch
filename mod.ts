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

  const isDark = url.searchParams.get("dark") !== null;
  const response = await fetch(toRawFileUrl(url));
  const bench = await response.json();

  return await renderChart({
    data: {
      labels: bench.benches.map(({ name }: any) => name),
      datasets: [{
        label: "avg. ns/iter",
        data: bench.benches.map(({ results }: any) => results[0].ok.avg),
        backgroundColor: url.searchParams.get("color") ?? ChartColors.Green,
      }],
    },
    options: {
      color: isDark ? "white" : undefined,
      scales: {
        y: {
          title: {
            display: true,
            text: "avg. ns/iter",
            color: isDark ? "white" : undefined,
          },
          grid: {
            color: isDark ? "rgba(255,255,255,0.5)" : undefined,
          },
          ticks: {
            color: isDark ? "white" : undefined,
          },
          border: {
            color: isDark ? "rgba(255,255,255,0.5)" : undefined,
          },
        },
        x: {
          grid: {
            color: isDark ? "rgba(255,255,255,0.5)" : undefined,
          },
          ticks: {
            color: isDark ? "white" : undefined,
          },
          border: {
            color: isDark ? "rgba(255,255,255,0.5)" : undefined,
          },
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
