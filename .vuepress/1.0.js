module.exports = [
  {
    title: "Getting Started",
    collapsable: true,
    children: ["introduction"]
  },
  {
    title: "Installation",
    collapsable: true,
    children: [
      "installation",
      "installation-nadi-api-app-key",
      "installation-nadi-client",
      "installation-nadi-shipper",
      "installation-nadi-testing",
      "installation-nadi-service"
    ]
  },
  {
    title: "Configuration",
    collapsable: true,
    children: [
      "configuration-nadi-sampling"
    ]
  }
];

function prefix(prefix, children) {
  return children.map(child => `${prefix}/${child}`);
}
