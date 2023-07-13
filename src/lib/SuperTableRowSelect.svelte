<script>
  import { getContext, createEventDispatcher } from "svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableSelectionStore = getContext("tableSelectionStore")
  const tableThemeStore = getContext("tableThemeStore")
  const dispatch = createEventDispatcher();

  // Keep scrolling position in synch
  let bodyContainer
  let id = "rowSelectColumn"

  $: selected_rows = Object.keys($tableSelectionStore).filter( v => $tableSelectionStore[v] == true)

  function handleScroll( e ) {
    if (e.isTrusted) {
      tableStateStore.synchScrollY ( bodyContainer?.scrollTop )
    }
  } 

  $: if ( bodyContainer ) bodyContainer.scrollTop = $tableStateStore.scrollY
  
  function toggleSelectAll ( ) {
    // if all are slected, uselect all else select all
    if (selected_rows.length == $tableDataStore.data.length) {
      $tableSelectionStore = {}
    } else {
      $tableDataStore.data.forEach(element => {
        $tableSelectionStore[element[$tableDataStore.idColumn]] = true
      });
    }

    dispatch ("selectionChange", { "rowID": -1} ) 
  }

  function handleSelection ( rowID ) {
    dispatch ("selectionChange", { "rowID": rowID} ) 
  }

</script>

<div style:width={"2.5rem"} class="spectrum-Table">

  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell">
      <label 
        class="spectrum-Checkbox spectrum-Checkbox--sizeM"
        class:is-indeterminate={selected_rows.length > 0 && selected_rows.length < $tableDataStore.data.length}>
        <input 
          on:click={() => ( toggleSelectAll() )} 
          type="checkbox" 
          class="spectrum-Checkbox-input" 
          title="Select All"
          checked={ (selected_rows.length == $tableDataStore.data.length) && ($tableDataStore.data.length > 0 ) }
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

  <div bind:this={bodyContainer} on:scroll|preventDefault={handleScroll} class="spectrum-Table-body">
  {#each $tableDataStore.data as row, index }
    <div 
      class="spectrum-Table-row" 
      on:mouseenter={ () => tableStateStore.hoverRow( null, index ) }
      on:mouseleave={ () => tableStateStore.unhoverRow() }
      class:is-selected={ $tableSelectionStore[row[$tableDataStore.idColumn]] } 
      class:is-hovered={ $tableStateStore.hoveredRow === index }
      style:min-height={ ($tableStateStore.rowHeights[index] || $tableStateStore.minRowHeight) + "px"  }
      >
        <label class="spectrum-Checkbox spectrum-Checkbox--sizeM">
          <input 
            bind:checked={$tableSelectionStore[row[$tableDataStore.idColumn]]}
            value={row[$tableDataStore.idColumn]} 
            on:change={ () => handleSelection (row[$tableDataStore.idColumn])}
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

  {#if $tableThemeStore.showFooter}
    <div class="spectrum-Table-footer"></div>
  {/if}
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