<script lang="ts">
  import WithTooltip from "./reusable/WithTooltip.svelte";

  export let icon: string;
  export let tips: string;
</script>

<WithTooltip {tips} let:builder>
  <button on:click class="rounded-full p-0.3em hover:bg-neutral-7 not-hover:text-neutral-3" {...builder} use:builder.action>
    <div class={icon} />
  </button>
</WithTooltip>
