<script>
  import { getContext, afterUpdate, beforeUpdate } from "svelte"
  const tableStateStore = getContext("tableStateStore")
  const tableThemeStore = getContext("tableThemeStore")

  // Keep scrolling position in synch
  let bodyContainer
  let id = "scroller"
  let shouldUpdate = false

  function handleScroll () {
    if ( $tableStateStore.scrollY !== bodyContainer?.scrollTop )
    {
      $tableStateStore.controllerID = id
      $tableStateStore.scrollY = bodyContainer?.scrollTop 
    }
  }

  beforeUpdate( () => {
    shouldUpdate = bodyContainer && ( $tableStateStore.controllerID != id  )
  })

  afterUpdate( () => {
    if ( shouldUpdate && bodyContainer ) bodyContainer.scrollTop = $tableStateStore.scrollY
  })
</script>

<div class="spectrum-Table">
  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"}></div>
  </div>

  <div on:scroll={handleScroll} bind:this={bodyContainer} class="spectrum-Table-body">
    {#each $tableStateStore.rowHeights as row }
      <div class="spectrum-Table-row" style:min-height={ row + "px" } style:border-color={"transparent"} ></div>
    {/each}
  </div>

  {#if $tableThemeStore.showFooter}
    <div class="spectrum-Table-footer"></div>
  {/if}
      
</div>

<style>
  .spectrum-Table-body {
    max-height: var(--super-table-body-height);
    display: flex;
    flex-direction: column;
    border-radius: 0px;
    overflow-y: scroll !important;
    overflow-x: hidden;
    padding: 0px;
    margin: 0px;
    border: unset;
    width: 10px;
  }

  .spectrum-Table-footer {
    min-height: 2.4rem;
    background-color: var(--super-table-footer-background-color);
  }
</style>