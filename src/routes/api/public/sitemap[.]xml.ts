import { createFileRoute } from "@tanstack/react-router";
import { createPublicClient } from "@/lib/supabase-public.server";

const STATIC_PATHS = [
  "/",
  "/products",
  "/about",
  "/reseller",
  "/wholesale",
  "/distributor",
  "/faqs",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/shipping-returns",
];

export const Route = createFileRoute("/api/public/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const supabase = createPublicClient();
        const { data } = await supabase.from("products").select("slug");

        const urls = [
          ...STATIC_PATHS.map((p) => `${origin}${p}`),
          ...(data ?? []).map((p) => `${origin}/products/${p.slug}`),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
