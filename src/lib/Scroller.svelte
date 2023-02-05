<script>
  import { getContext, afterUpdate } from "svelte"
  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")

  // Keep scrolling position in synch
  let bodyContainer

  afterUpdate(() => {
    if (bodyContainer && bodyContainer?.scrollTop != $tableStateStore.scrollY)
      bodyContainer.scrollTop = $tableStateStore.scrollY
  })
</script>

<div class="spectrum-Table">
  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell"></div>
  </div>

  <div bind:this={bodyContainer} class="spectrum-Table-body">
    {#each $tableDataStore.data as row, index }
      <div class="spectrum-Table-row" style:min-height={$tableStateStore?.rowHeights[index] + "px" }>
      </div>
    {/each}
  </div>

  <div class="spectrum-Table-footer"></div>
</div>

<style>
  .spectrum-Table-row {
    padding: unset;
    margin: unset;
    width: 0px;
  }

  .spectrum-Table-body {
    max-height: var(--super-table-body-height);
    display: flex;
    flex-direction: column;
    border-radius: 0px;
    overflow-y: scroll;
    overflow-x: hidden;
    border: none;
    padding: 0px;
    margin: 0px;
  }

  .spectrum-Table-footer {
    min-height: 2.4rem;
    background-color: var(--super-table-footer-background-color);
  }
</style>