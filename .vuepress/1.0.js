module.exports = [
  {
    title: "Getting Started",
    collapsable: false,
    children: ["introduction","installation","configuration","testing"]
  }
];

function prefix(prefix, children) {
  return children.map(child => `${prefix}/${child}`);
}
