// postcss.config.js
const isProd = process.env.NODE_ENV === "production";

export default {
  plugins: [
    // Resolve @import statements — gives us SCSS-style partials
    (await import("postcss-import")).default,

    // Vendor prefixes
    (await import("autoprefixer")).default,

    // Minify in production only
    ...(isProd
      ? [(await import("cssnano")).default({ preset: "default" })]
      : []),
  ],
};
