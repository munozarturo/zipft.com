(function () {
    var systemDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    var favicon = document.querySelector("link[rel~='icon']");
    var href = systemDarkMode ? "/favicon-dark.ico" : "/favicon.ico";

    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = href;
})();
