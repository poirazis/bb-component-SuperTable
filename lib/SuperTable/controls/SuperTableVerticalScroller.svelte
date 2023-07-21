<script>
  import { getContext, beforeUpdate } from "svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableScrollPosition = getContext("tableScrollPosition")
  const tableOptions = getContext("tableOption")

  // Keep scrolling position in synch
  let bodyContainer
  let mouseOver

  function handleScroll( e ) {
    if ( mouseOver ) {
      $tableScrollPosition = bodyContainer?.scrollTop;
    }
  }

  beforeUpdate( () => { if ( bodyContainer ) bodyContainer.scrollTop = $tableScrollPosition } )
</script>

<div class="superTableScroller" on:mouseenter={() => mouseOver = true } on:mouseleave={() => mouseOver = false } >
  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"}></div>
  </div>

  <div bind:this={bodyContainer} class="spectrum-Table-body">
    {#each $tableDataStore.data as row , idx }
      <div class="spectrum-Table-row" style:height={ $tableStateStore.rowHeights[idx] + "px" } style:border-color={"transparent"} ></div>
    {/each}
  </div>

  {#if tableOptions?.columnOptions?.showFooter }
    <div class="spectrum-Table-footer"></div>
  {/if}
      
</div>

<style>
  .superTableScroller {
    width: 12px;
  }

  .spectrum-Table-body {
    height: var(--super-table-body-height);
    border-radius: 0px;
    overflow-y: scroll !important;
    width: 12px;
    border: unset;
  }

  .spectrum-Table-footer {
    min-height: 2.4rem;
    background-color: var(--super-table-footer-background-color);
  }
</style>