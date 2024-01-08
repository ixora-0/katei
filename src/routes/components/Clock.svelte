<script lang="ts">
  import type { Settings } from "$lib/stores/settings";
  import FancyHover from "./FancyHover.svelte";

  export let clockSettings: Settings["clock"];
  let dateOptions: Intl.DateTimeFormatOptions | undefined;
  let timeOptions: Intl.DateTimeFormatOptions | undefined;
  $: {
    dateOptions = {
      year: "numeric",
      day: "numeric",
    };
    if (clockSettings.date.weekdayFormat !== "hide") {
      dateOptions.weekday = clockSettings.date.weekdayFormat;
    }
    if (clockSettings.date.monthFormat !== "hide") {
      dateOptions.month = clockSettings.date.monthFormat;
    }
    timeOptions = {
      hour12: clockSettings.time.twelveHour,
      hour: clockSettings.time.paddedHour ? "2-digit" : "numeric",
      minute: "2-digit",
    };
    if (clockSettings.time.showSeconds) {
      timeOptions.second = "2-digit";
    }
  }

  let date: string | undefined;
  let time: string | undefined;

  const update = () => {
    if (dateOptions === undefined || timeOptions === undefined) {
      setTimeout(update, 250);
      return;
    }
    const now = new Date();

    const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);
    const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);

    date = dateFormatter.format(now);
    time = timeFormatter.format(now);

    // DateTimeFormat doesn't remove leading zero for this case, have to remove manually
    if (!timeOptions.hour12 && timeOptions.hour === "numeric") {
      time = time.replace(/^0/, "");
    }
    setTimeout(update, 1000);
  };
  update();
</script>

{#if clockSettings.visibility}
  <h1
    class="font-sans text-8xl font-black leading-none tracking-tight text-text"
  >
    <FancyHover
      trackingEffect={false}
      dropShadow="drop-shadow-hard-lg"
      dropShadowHover="hover:drop-shadow-hard-md"
    >
      {#if date === undefined || time === undefined}
        Loading...
      {:else}
        {date}
        {#if clockSettings.breakDateTime}
          <br />
        {/if}
        {time}
      {/if}
    </FancyHover>
  </h1>
{/if}
