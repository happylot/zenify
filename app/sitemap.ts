import type { MetadataRoute } from "next";
import {
  comparisonItems,
  featureItems,
  helpItems,
  solutionItems,
} from "@/lib/site-data";

const baseUrl = "https://zenify.cx";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/features",
    "/solutions",
    "/comparison",
    "/help",
    "/customers",
    "/customers/customer-stories",
    "/pricing",
    "/signup",
    "/billing",
    "/trial",
    "/app",
    "/app/dashboard",
    "/app/inbox",
    "/app/automation",
    "/app/analytics",
    "/app/billing",
    "/app/settings",
    "/enterprise",
    "/contact",
    "/webinars",
    "/careers",
    "/legal",
    "/legal/privacy-policy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  const featureRoutes = featureItems.map((item) => ({ url: `${baseUrl}/features/${item.slug}` }));
  const solutionRoutes = solutionItems.map((item) => ({ url: `${baseUrl}/solutions/${item.slug}` }));
  const comparisonRoutes = comparisonItems.map((item) => ({
    url: `${baseUrl}/comparison/${item.slug}`,
  }));
  const helpRoutes = helpItems.map((item) => ({ url: `${baseUrl}/help/${item.slug}` }));

  return [...staticRoutes, ...featureRoutes, ...solutionRoutes, ...comparisonRoutes, ...helpRoutes];
}
