<script>
  import { getContext, createEventDispatcher, beforeUpdate } from "svelte"
  import Checkbox from "../../../node_modules/@budibase/bbui/src/Form/Core/Checkbox.svelte"

  const tableDataStore = getContext("tableDataStore")
  const tableStateStore = getContext("tableStateStore")
  const tableSelectionStore = getContext("tableSelectionStore")
  const tableScrollPosition = getContext("tableScrollPosition")
  const tableOptions = getContext("tableOptions")
  const tableHoverStore = getContext("tableHoverStore")
  const dispatch = createEventDispatcher();

  // Keep scrolling position in synch
  let bodyContainer
  let mouseOver = false

  $: selected_rows = Object.keys($tableSelectionStore).filter( v => $tableSelectionStore[v] == true) ?? []

  function handleScroll( e ) {
    if ( mouseOver ) {
      $tableScrollPosition = bodyContainer?.scrollTop;
    }
  }

  beforeUpdate( () => { if ( bodyContainer && !mouseOver ) bodyContainer.scrollTop = $tableScrollPosition } )

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

    let selected = Object.keys($tableSelectionStore)

    if ( selected.includes ( rowID ) ) {
      delete $tableSelectionStore[rowID] 
      $tableSelectionStore = $tableSelectionStore
    }
    else
      $tableSelectionStore[rowID] = true
  }

</script>

<div style:width={"2.5rem"} class="spectrum-Table" on:mouseleave={() => ($tableHoverStore = null)} >
  <div class="spectrum-Table-head">
    <div style:min-height={"2.5rem"} class="spectrum-Table-headCell">
      <Checkbox
        on:change={toggleSelectAll}
        indeterminate={ selected_rows.length > 0 && (selected_rows.length !== $tableDataStore.data.length) }
        value = { selected_rows.length > 0 && (selected_rows.length == $tableDataStore.data.length) }
      />
    </div>
  </div>

  <div bind:this={bodyContainer} on:scroll|preventDefault={handleScroll} class="spectrum-Table-body">
  {#each $tableDataStore.data as row, index }
    <div 
      class="spectrum-Table-row" 
      on:mouseenter={ () => $tableHoverStore = index }
      class:is-selected={ $tableSelectionStore[row[$tableDataStore.idColumn]] } 
      class:is-hovered={ $tableHoverStore === index }
      style:min-height={ ($tableStateStore.rowHeights[index] || $tableStateStore.minRowHeight) + "px"  }
      >
        <Checkbox 
          value = {$tableSelectionStore[row[$tableDataStore.idColumn]]}
          on:change={ (e) => handleSelection( row[$tableDataStore.idColumn] ) }
        />
      </div>
  {/each}
  </div>

  {#if tableOptions?.columnOption?.showFooter }
    <div class="spectrum-Table-footer"></div>
  {/if}
</div>

<style>

  .spectrum-Table-headCell {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    padding: unset;
    border-bottom: 1px solid var(--spectrum-alias-border-color-mid);
    border-right: var(--super-table-vertical-dividers);
  }

  .spectrum-Table-row {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: unset;
    margin: unset;

  }

  .is-hovered {
    background-color: var(--spectrum-table-m-regular-row-background-color-hover, var(--spectrum-alias-highlight-hover));
	}

  .is-hovered.is-selected {
    background-color: var(--spectrum-table-m-regular-row-background-color-selected-hover, var(--spectrum-alias-highlight-selected-hover));
	}

  .spectrum-Table-body {
    height: var(--super-table-body-height);
    border-radius: 0px;
    overflow-y: scroll !important;
    overflow-x: hidden;
    padding: 0px;
    margin: 0px;
    border: none;
    scrollbar-width: none;
    border-right: var(--super-table-vertical-dividers);
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