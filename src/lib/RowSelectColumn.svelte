<script>
  import { getContext, createEventDispatcher, afterUpdate } from "svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const dispatch = createEventDispatcher();

  // Keep scrolling position in synch
  let bodyContainer

  afterUpdate(() => {
    if (bodyContainer && bodyContainer?.scrollTop != $tableStateStore.scrollY)
      bodyContainer.scrollTop = $tableStateStore.scrollY
  })
  
  function toggleSelectAll ( ) {
    // TODO : If partially selected, select all else unselect all
  }
</script>

<div style:width={"2.5rem"} class="spectrum-Table">

  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell">
      <label class="spectrum-Checkbox spectrum-Checkbox--sizeM">
        <input on:click={() => ( toggleSelectAll() )} type="checkbox" class="spectrum-Checkbox-input" title="Select All">
        <span class="spectrum-Checkbox-box">
          <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Checkmark100" />
          </svg>
        </span>
      </label>
    </div>
  </div>

  <div bind:this={bodyContainer} class="spectrum-Table-body">
  {#each $tableDataStore.data as row, index }
    <div 
      class="spectrum-Table-row" 
      on:mouseenter={ () => { if ($tableStateStore.hoveredRow !== index ) $tableStateStore.hoveredRow = index }} 
      on:mouseleave={ () => { $tableStateStore.hoveredRow = null } } 
      class:is-selected={ $tableDataStore.selectedRows.includes(row[$tableDataStore.idColumn]) } 
      class:is-hovered={ $tableStateStore.hoveredRow === index }
      style:min-height={ $tableStateStore.rowHeights[index] + "px" }
      >
      <div class="spectrum-Table-cell">
        <label class="spectrum-Checkbox spectrum-Checkbox--sizeM">
          <input bind:group={$tableDataStore.selectedRows} value={row[$tableDataStore.idColumn]} type="checkbox" class="spectrum-Checkbox-input" id="checkbox-0">
          <span class="spectrum-Checkbox-box">
            <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
            <svg class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark" focusable="false" aria-hidden="true">
              <use xlink:href="#spectrum-css-icon-Dash100" />
            </svg>
          </span>
        </label>
      </div>
    </div>
  {/each}
  </div>

  <div class="spectrum-Table-footer">
  </div>

</div>

<style>
  .spectrum-Table-headCell {
    min-width: 2.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: unset !important;
  }

  .spectrum-Table-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom-width: var(--super-table-row-bottom-border-size);
  }

  .is-hovered {
    background-color: var(--spectrum-table-m-regular-row-background-color-hover, var(--spectrum-alias-highlight-hover));
	}

  .is-hovered.is-selected {
    background-color: var(--spectrum-table-m-regular-row-background-color-selected-hover, var(--spectrum-alias-highlight-selected-hover));
	}

  .spectrum-Table-body {
    max-height: var(--super-table-body-height);
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    border-radius: 0px;
    overflow: scroll;
    border: none;
    padding: 0px;
    margin: 0px;
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