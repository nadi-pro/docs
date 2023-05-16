module.exports = {
  title: "Nadi",
  description: "A simple issue tracker for monitoring your application crashes",
  base: "/docs/",

  plugins: [
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      },
    ],
    require("./plugins/metaVersion.js")
  ],

  head: [
    [
      "link",
      {
        href:
          "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,800,800i,900,900i",
        rel: "stylesheet",
        type: "text/css"
      }
    ],
    // Used for PWA
    [
      "link",
      {
        rel: "manifest",
        href: "/manifest.json"
      }
    ],
    [
      "link",
      {
        rel: "icon",
        href: "/icon.png"
      }
    ]
  ],

  themeConfig: {
    logo: "/assets/img/logo.jpg",
    displayAllHeaders: false,
    activeHeaderLinks: false,
    searchPlaceholder: "Search...",
    lastUpdated: "Last Updated", // string | boolean
    sidebarDepth: 0,

    nav: [
      { text: "Home", link: "https://docs.nadi.pro" },
      {
        text: "Version",
        link: "/",
        items: [
          { text: "1.0", link: "/1.0/" },
        ]
      }
    ],

    sidebar: {
      "/1.0/": require("./1.0"),
    }
  }
};
