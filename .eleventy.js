const yaml = require("js-yaml");
const htmlmin = require('html-minifier');
const now = String(Date.now());
const svgContent = require('./config/shortcodes/svgcontent.js');
const iconShortcode = require('./config/shortcodes/feathericons.js');

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./assets/js/site.js": "./assets/js/site.js",
    "./node_modules/alpinejs/dist/cdn.min.js": './assets/js/alpine.js',
    "./node_modules/htmx.org/dist/htmx.min.js": './assets/js/htmx.js',
    "./assets/webfonts": "./assets/webfonts",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/assets/image");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Watch the scss files
  eleventyConfig.addWatchTarget('./assets/scss/city.scss');
  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './assets/css' });
  
  // Watch the js files for esbuild in scripts.11ty.js
  eleventyConfig.addWatchTarget('./assets/js');

  // Sections
  // eleventyConfig.addCollection("sections", function(collectionApi) {
  //  return collectionApi.getFilteredByGlob("sections/**/*.md");
  // });

  // Shortcodes
  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', function () {
    return now
  });

  // Insert any .svg file with {% icon "github" %} saved in .assets/images/svg/
  eleventyConfig.addShortcode('svg', svgContent);
  
  // Insert a feather-icon with {% icon "github" %} from https://feathericons.com/
  eleventyConfig.addShortcode('icon', iconShortcode);

  // Change things based on the envirnoment
  let env = process.env.ELEVENTY_ENV;

  if (env === "prod") {
    eleventyConfig.addPassthroughCopy({ './assets/images/favicon/11up.jpg': './assets/images/11up.jgp'})
  }

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV === "prod" &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })
  
  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid
  // 11ty.js template format also picks up on the esbuild.11ty.js script

  return {
    markdownTemplateEngine: 'liquid',
    templateFormats: ['html', 'liquid', 'md', '11ty.js'],
    dataTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
