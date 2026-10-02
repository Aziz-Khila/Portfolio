export const MOTION_STORAGE_KEY = "motion";

// Runs before first paint: a saved choice wins, otherwise follow the OS setting.
export const motionInitScript = `(function(){var m;try{m=localStorage.getItem("${MOTION_STORAGE_KEY}")}catch(e){}if(m!=="full"&&m!=="reduced")m=matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full";document.documentElement.dataset.motion=m})()`;
