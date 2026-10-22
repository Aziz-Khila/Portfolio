export const THEME_STORAGE_KEY = "theme";

// Runs before first paint: a saved choice wins, otherwise follow the OS setting.
// Also swaps the Khila favicon to match the active theme.
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;var l=document.createElement("link");l.rel="icon";l.type="image/svg+xml";l.dataset.themeIcon="1";l.href=t==="light"?"/media/khila-icon-light.svg":"/media/khila-icon.svg";document.head.appendChild(l)})()`;
