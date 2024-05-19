import { browser } from "$app/environment";
import { writable, get } from "svelte/store";
import tinycolor from "tinycolor2";

export interface Settings {
  colors: {
    background: string;
    text: string;
    border: string;
    shadow: string;
    selected: string;
  };
  clock: {
    visibility: boolean;
    breakDateTime: boolean;
    date: {
      weekdayFormat: "long" | "short" | "hide";
      monthFormat: "numeric" | "2-digit" | "long" | "short" | "hide";
    };
    time: {
      twelveHour: boolean;
      paddedHour: boolean;
      showSeconds: boolean;
    };
  };
  searchBar: {
    visibility: boolean;
    autofocus: boolean;
    newTab: boolean;
    placeholder: string;
    searchEngine: string;
    queryParameter: string;
  };
}
const defaultSettings: Settings = {
  colors: {
    background: "#292B38",
    text: "#ffffff",
    border: "#ffffff",
    shadow: "#00000080",
    selected: "#2196F3",
  },
  clock: {
    visibility: true,
    breakDateTime: true,
    date: {
      weekdayFormat: "long",
      monthFormat: "long",
    },
    time: {
      twelveHour: false,
      paddedHour: true,
      showSeconds: true,
    },
  },
  searchBar: {
    visibility: true,
    autofocus: true,
    newTab: false,
    placeholder: "search something...",
    searchEngine: "https://www.google.com/search",
    queryParameter: "q",
  },
};

export function reloadSettingsStore() {
  settings.set(loadLocalSettings());
}

function saveDefaultSettings() {
  if (browser) {
    window.localStorage.setItem("settings", JSON.stringify(defaultSettings));
  }
}

/**
 * Return settings stored in local storage.
 * Save and return the default settings if data is missing or can't be parsed.
 */
function loadLocalSettings(): Settings {
  const storedData = window.localStorage.getItem("settings");
  if (storedData === null) {
    saveDefaultSettings();
    return { ...defaultSettings };
  }

  let parsedData: Partial<Settings>;
  try {
    parsedData = JSON.parse(storedData);
  } catch (e) {
    // throw error(400, "can't parse settings");
    saveDefaultSettings();
    return defaultSettings;
  }

  const storedSettings: Settings = { ...defaultSettings, ...parsedData };

  // replace invalid color values
  for (const k of Object.keys(storedSettings.colors)) {
    const colorKey = k as keyof Settings["colors"];
    if (!tinycolor(storedSettings.colors[colorKey]).isValid()) {
      storedSettings.colors[colorKey] = defaultSettings.colors[colorKey];
    }
  }

  return storedSettings;
}

// when prerendering (ie. on server) we don't load from local storage
const initialSettings = browser ? loadLocalSettings() : defaultSettings;

const settings = writable<Settings>(initialSettings);

export default settings;

/**
 * Save settings from store to local storage
 */
export function saveSettings() {
  if (browser) {
    window.localStorage.setItem("settings", JSON.stringify(get(settings)));
  }
}
