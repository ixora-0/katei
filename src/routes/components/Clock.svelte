<script lang="ts">
  import { onMount } from "svelte";
  import FancyHover from "./FancyHover.svelte";
  export let twentyFour: boolean = false;
  export let dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  export let timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  };

  let display: string = "Loading...";
  const update = () => {
    const now = new Date();

    const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour12: !twentyFour,
      ...timeOptions,
    });

    const formattedDate = dateFormatter.format(now);
    const formattedTime = timeFormatter.format(now);

    display = `${formattedDate}\n${formattedTime}`;
  };

  // Update every second, starting after mounting
  onMount(() => {
    setInterval(() => {
      update();
    }, 1000);
  });
</script>

<h1 class="font-sans text-8xl font-black leading-none tracking-tight text-text">
  <FancyHover
    trackingEffect={false}
    dropShadow="drop-shadow-hard-lg"
    dropShadowHover="hover:drop-shadow-hard-md">{display}</FancyHover
  >
</h1>
