import { browser } from "$app/environment";
import { writable, get } from "svelte/store";
import { error } from "@sveltejs/kit";
import tinycolor from "tinycolor2";

export interface Settings {
  colors: {
    background: string;
    text: string;
    border: string;
    shadow: string;
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
}
const defaultSettings: Settings = {
  colors: {
    background: "#292B38",
    text: "#ffffff",
    border: "#ffffff",
    shadow: "#00000080",
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
};

export function reloadSettings() {
  settings.set(loadStoredSettings());
}

function loadStoredSettings(): Settings {
  const storedData = window.localStorage.getItem("settings");
  if (storedData === null) {
    return { ...defaultSettings };
  }

  let parsedData: Partial<Settings>;
  try {
    parsedData = JSON.parse(storedData);
  } catch (e) {
    throw error(400, "can't parse settings");
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
const initialSettings = browser ? loadStoredSettings() : defaultSettings;

const settings = writable<Settings>(initialSettings);

export default settings;

export function saveSettings() {
  if (browser) {
    window.localStorage.setItem("settings", JSON.stringify(get(settings)));
  }
}
