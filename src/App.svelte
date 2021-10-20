<script>
  //js imports
  import { Router, Route } from "svelte-navigator";
  //components
  import Nav from "./lib/nav.svelte";
  // stores
  import { Routes } from "./stores/routes";

  export let url = "";
</script>

<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/sef6vku.css">

</svelte:head>

<main>
  <Nav />
  <Router url="{url}">
    {#each Routes as path}
      <Route path={path.routeUrl}>
        <svelte:component this={path.component} />
      </Route>
    {/each}
  </Router>

</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
  }

  
</style>
