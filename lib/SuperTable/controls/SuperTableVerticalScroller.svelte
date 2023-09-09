<script>
  import { getContext, beforeUpdate } from "svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableScrollPosition = getContext("tableScrollPosition")

  // Keep scrolling position in synch
  let bodyContainer
  let mouseOver
  export let tableOptions

  function handleScroll( e ) {
    if ( mouseOver ) {
      $tableScrollPosition = bodyContainer?.scrollTop;
    }
  }

  beforeUpdate( () => { if ( bodyContainer ) bodyContainer.scrollTop = $tableScrollPosition } )
</script>

<div class="superTableScroller" on:mouseenter={() => mouseOver = true } on:mouseleave={() => mouseOver = false } >

  {#if tableOptions.showHeader}
    <div class="spacer" style:min-height={"2.5rem"}></div>
  {/if}

  <div bind:this={bodyContainer} class="spectrum-Table-body" on:scroll={handleScroll}>
    {#each $tableDataStore.data as _ , idx }
      <div class="spectrum-Table-row" style:height={ $tableStateStore.rowHeights[idx] + "px" } style:border-color={"transparent"} ></div>
    {/each}
  </div>

  {#if tableOptions.showFooter}
    <div class="spectrum-Table-footer"></div>
  {/if}
      
</div>

<style>
  
  .superTableScroller {
    background-color: transparent;
    z-index: 2;
  }

  .spacer {
    background: transparent;
    border: none;
  }
  .superTableScroller {
    width: 12px;
  }

  .spectrum-Table-body {
    height: var(--super-table-body-height);
    border-radius: 0px;
    overflow-y: scroll !important;
    width: 12px;
    border: unset;
    background-color: transparent;
  }

  .spectrum-Table-footer {
    min-height: 2.4rem;
    background-color: var(--super-table-footer-background-color);
  }
</style>