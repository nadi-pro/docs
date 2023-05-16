var versions = ["1.0"];
var currentVersion = versions[versions.length - 1]

module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const { regularPath, frontmatter } = $page;

    frontmatter.meta = [];

    versions.forEach(function(version) {
      if (regularPath.includes("/" + version + "/")) {
        frontmatter.meta.push({
          name: "docsearch:version",
          content: version + ".0"
        });
        console.log(version);
        frontmatter.canonicalUrl = context.base + regularPath.replace("/" + version + "/", "/" + currentVersion + "/").substring(1);
      }
    });
  }
});
