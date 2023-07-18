<script>
  import { getContext } from "svelte"
  import Skeleton from "./Skeleton.svelte";

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableSelectionStore = getContext("tableSelectionStore")

</script>

<div class="spectrum-Table" style="width: 100%;">

  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell">
      Loading ... 
    </div>
  </div>

  <div class="spectrum-Table-body">
  {#each $tableStateStore.rowHeights as row, index }
    <div class="spectrum-Table-row" style:min-height={ $tableStateStore.rowHeights[index] + "px" }>
      <div class="spectrum-Table-cell" style="width: 100%;">
        <Skeleton> Loading ... </Skeleton>
      </div>
    </div>
  {/each}
  </div>

  <div class="spectrum-Table-footer"></div>

</div>

<style>
  .spectrum-Table-headCell {
    min-width: 2.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .spectrum-Table-row {
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom-width: var(--super-table-row-bottom-border-size);
  }

  .spectrum-Table-body {
    max-height: var(--super-table-body-height);
    display: flex;
    flex-direction: column;
    border-radius: 0px;
    padding: 0px;
    margin: 0px;
    border-left: unset;
    border-top: unset;
    border-bottom: unset;
    border-right-width: var(--super-table-column-right-border-size);
    scrollbar-width: none;   
  }

  .spectrum-Table-body::-webkit-scrollbar {
    display: none;
  }
  .spectrum-Table-footer {
    width: 100%;
    min-height: 2.4rem;
    background-color: var(--super-table-footer-background-color);
  }
</style>