// eleventy.config.js
import { feedPlugin }  from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { readFileSync } from "fs";

export default function (eleventyConfig) {

  // ============================================================
  // PLUGINS
  // ============================================================

  // RSS / Atom feed
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "posts",
      limit: 20,
    },
    metadata: {
      language: "nl",  // change per project
      title:    "Site title",
      subtitle: "Site description",
      base:     "https://example.com/",
      author: {
        name:  "Author name",
        email: "author@example.com",
      },
    },
  });

  // Automatic image optimisation
  // Transforms <img> tags in output HTML — no template changes needed
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "auto"],
    widths: ["auto", 400, 800, 1200, 1600],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(min-width: 1024px) 1280px, 100vw",
    },
  });

  // ============================================================
  // PASSTHROUGH COPY
  // Files copied as-is to the output directory
  // ============================================================

  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });  // robots.txt, favicon, etc.

  // ============================================================
  // WATCH TARGETS
  // Tell Eleventy to rebuild when CSS changes
  // ============================================================

  eleventyConfig.addWatchTarget("src/css/");

  // ============================================================
  // FILTERS
  // ============================================================

  // Format a date for display
  // Usage: {{ page.date | dateDisplay }}
  eleventyConfig.addFilter("dateDisplay", (date) => {
    return new Date(date).toLocaleDateString("nl-NL", {
      year:  "numeric",
      month: "long",
      day:   "numeric",
    });
  });

  // Format a date as ISO string (for <time datetime="">)
  eleventyConfig.addFilter("dateISO", (date) => {
    return new Date(date).toISOString();
  });

  // Limit an array to N items
  // Usage: {% for post in collections.posts | limit(3) %}
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Strip HTML tags (useful for meta descriptions from content)
  eleventyConfig.addFilter("stripHtml", (str) => {
    return str.replace(/<[^>]*>/g, "");
  });

  // Truncate a string to N characters
  eleventyConfig.addFilter("truncate", (str, n = 160) => {
    if (str.length <= n) return str;
    return str.slice(0, n).trimEnd() + "…";
  });

  // ============================================================
  // SHORTCODES
  // ============================================================

  // Inline SVG from /src/static/icons/
  // Usage: {% svg "arrow" %}
  eleventyConfig.addShortcode("svg", (name) => {
    try {
      return readFileSync(`src/static/icons/${name}.svg`, "utf8");
    } catch {
      return `<!-- SVG '${name}' not found -->`;
    }
  });

  // Current year — useful in footers
  // Usage: {% year %}
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // ============================================================
  // COLLECTIONS
  // ============================================================

  // All posts, newest first
  eleventyConfig.addCollection("posts", (collection) => {
    return collection
      .getFilteredByGlob("src/content/posts/**/*.md")
      .reverse();
  });

  // All pages
  eleventyConfig.addCollection("pages", (collection) => {
    return collection.getFilteredByGlob("src/content/pages/**/*.md");
  });

  // ============================================================
  // CONFIGURATION
  // ============================================================

  return {
    dir: {
      input:    "src",
      output:   "public",
      includes: "_includes",
      data:     "_data",
    },
    templateFormats:      ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine:    "njk",
  };
}
