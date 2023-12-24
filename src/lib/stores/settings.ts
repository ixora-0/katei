import { browser } from "$app/environment";
import { writable, get } from "svelte/store";
import { error } from "@sveltejs/kit";
import tinycolor from "tinycolor2";

interface Settings {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
}
const defaultSettings: Settings = {
  backgroundColor: "#292B38",
  textColor: "#ffffff",
  borderColor: "#ffffff",
  shadowColor: "#00000080",
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

  // replace invalid values
  for (const k of Object.keys(storedSettings)) {
    const colorKey = k as keyof Settings;
    if (!tinycolor(storedSettings[colorKey]).isValid()) {
      storedSettings[colorKey] = defaultSettings[colorKey];
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
