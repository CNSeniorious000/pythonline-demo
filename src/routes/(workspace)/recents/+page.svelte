<script lang="ts">
  import { showEditor } from "../store";
  import { recents } from "../telegraph/store";

  $showEditor = false;
</script>

<div class="fixed inset-0 grid place-items-center">
  <div class="max-w-1/2 flex flex-col gap-3">

    <h1 class="text-lg">最近打开</h1>

    <ol class="flex flex-row flex-wrap gap-2 text-sm">

      {#each Object.entries($recents) as [path, { title, author }]}
        <li class="contents">
          <a href="/telegraph/{path}" class="flex flex-row gap-1 border-2 border-neutral-8 rounded-sm p-2 text-neutral-3 font-normal hover:bg-neutral-8">
            <h2>{title}</h2>
            <h3>{author}</h3>
          </a>
        </li>
      {:else}
        <div class="mt-3 h-lg text-neutral-5">
          目前是空的
        </div>
      {/each}

    </ol>

  </div>
</div>
