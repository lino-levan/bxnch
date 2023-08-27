// deno-lint-ignore-file no-explicit-any
import { renderChart } from "fresh_charts/render.ts";
import { ChartColors } from "fresh_charts/utils.ts";
import { Status } from "std/http/http_status.ts";

export function toRawFileUrl(url: URL) {
  return url.toString().replace(
    url.origin,
    "https://raw.githubusercontent.com",
  );
}

export async function handler(request: Request) {
  if (request.method !== "GET") {
    await request.body?.cancel();
    return new Response(null, { status: Status.NotFound });
  }

  const url = new URL(request.url);
  if (url.pathname === "/") {
    return Response.redirect("https://github.com/iuioiua/bxnch");
  }

  if (url.pathname === "/favicon.ico") {
    return new Response(null, { status: Status.NotFound });
  }

  const isDark = url.searchParams.get("dark") !== null;
  const response = await fetch(toRawFileUrl(url));

  if (!response.ok) {
    return new Response(response.body, { ...response, headers: {} });
  }

  const bench = await response.json();

  return await renderChart({
    width: Number(url.searchParams.get("width") ?? "768"),
    height: Number(url.searchParams.get("height") ?? "384"),
    data: {
      labels: bench.benches.map(({ name }: any) => name),
      datasets: [{
        label: "Performance (avg. ns/iter)",
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
            text: "Performance (avg. ns/iter)",
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

if (import.meta.main) {
  Deno.serve(handler);
}
