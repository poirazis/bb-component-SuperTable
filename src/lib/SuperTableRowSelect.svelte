<script>
  import { getContext, createEventDispatcher, afterUpdate, beforeUpdate } from "svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableSelectionStore = getContext("tableSelectionStore")
  const dispatch = createEventDispatcher();

  // Keep scrolling position in synch
  let bodyContainer
  let shouldUpdate = false
  let id = "rowSelectColumn"

  function handleScroll () {
    if ( $tableStateStore.scrollY !== bodyContainer?.scrollTop )
    {
      $tableStateStore.controllerID = id
      $tableStateStore.scrollY = bodyContainer?.scrollTop 
    }
  }

  beforeUpdate (() => { shouldUpdate = (bodyContainer && $tableStateStore.controllerID !== id)})
  afterUpdate(() => {
    if (shouldUpdate && bodyContainer) {
      bodyContainer.scrollTop = $tableStateStore.scrollY
    }
  })
  
  function toggleSelectAll ( ) {
    if ($tableSelectionStore.length == $tableDataStore.data.length) {
      $tableSelectionStore = []
    } else {
      $tableSelectionStore = $tableDataStore.data.map ( row => row[$tableDataStore.idColumn] )
    }
  }
</script>

<div style:width={"2.5rem"} class="spectrum-Table">

  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell">
      <label 
        class="spectrum-Checkbox spectrum-Checkbox--sizeM"
        class:is-indeterminate={$tableSelectionStore.length > 0 && $tableSelectionStore.length < $tableDataStore.data.length}>
        <input 
          on:click={() => ( toggleSelectAll() )} 
          type="checkbox" 
          class="spectrum-Checkbox-input" 
          title="Select All"
          checked={$tableSelectionStore.length == $tableDataStore.data.length}
          >
        <span class="spectrum-Checkbox-box">
          <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Checkmark100" />
          </svg>
          <svg class="spectrum-Icon spectrum-UIIcon-Dash50 spectrum-Checkbox-partialCheckmark" focusable="false" aria-hidden="true">
            <use xlink:href="#spectrum-css-icon-Dash50" />
          </svg>
        </span>
      </label>
    </div>
  </div>

  <div bind:this={bodyContainer} on:scroll={handleScroll} class="spectrum-Table-body">
  {#each $tableDataStore.data as row, index }
    <div 
      class="spectrum-Table-row" 
      on:mouseenter={ () => { if ($tableStateStore.hoveredRow !== index ) $tableStateStore.hoveredRow = index }} 
      on:mouseleave={ () => { $tableStateStore.hoveredRow = null } } 
      class:is-selected={ $tableSelectionStore.includes(row[$tableDataStore.idColumn]) } 
      class:is-hovered={ $tableStateStore.hoveredRow === index }
      style:min-height={ $tableStateStore.rowHeights[index] + "px" }
      >
        <label class="spectrum-Checkbox spectrum-Checkbox--sizeM">
          <input 
            bind:group={$tableSelectionStore} 
            value={row[$tableDataStore.idColumn]} 
            on:change={ () => dispatch ("selectionChange", { "rowID": row[$tableDataStore.idColumn] }) }
            type="checkbox" 
            class="spectrum-Checkbox-input" 
          >
          <span class="spectrum-Checkbox-box">
            <svg class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark" focusable="false" aria-hidden="true">
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
          </span>
        </label>
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
    padding: unset;
    margin: unset;
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
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    border-radius: 0px;
    overflow-y: scroll !important;
    overflow-x: hidden;
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