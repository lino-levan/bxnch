import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

serve((_req) => new Response("Hello, World!"));
