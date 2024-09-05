<script lang="ts">
  import type { PageServerData } from "./$types";

  import { showEditor, sources } from "../../store";
  import { recents } from "../store";
  import { page } from "$app/stores";

  export let data: PageServerData;

  $sources = data.sources;
  $showEditor = true;

  const metadata = $recents[$page.params.path];

  if (metadata) {
    metadata.title = data.title;
    metadata.author = data.author;
  }
  else {
    const { title, author, own } = data;
    $recents[$page.params.path] = { title, author, own };
  }
</script>
