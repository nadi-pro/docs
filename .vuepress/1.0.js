module.exports = [
  {
    title: "Getting Started",
    collapsable: false,
    children: ["introduction"]
  },
  {
    title: "Installation",
    collapsable: false,
    children: [
      "installation",
      "installation-nadi-api-app-key",
      "installation-nadi-client",
      "installation-nadi-shipper",
      "installation-nadi-testing",
      "installation-nadi-service"
    ]
  }
];

function prefix(prefix, children) {
  return children.map(child => `${prefix}/${child}`);
}
