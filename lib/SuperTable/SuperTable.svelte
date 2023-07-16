<script>
  import { getContext, setContext, onMount, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store"
  import { LuceneUtils } from "../frontend-core"

  import { createSuperTableDataStore, 
           createSuperTableFilterStore, 
           createSuperTableStateStore } from "./stores/superTableStores.js"

  import { sizingMap } from "./themes/superTableThemes.js"

  import SuperTableVerticalScroller from "./controls/SuperTableVerticalScroller.svelte";
  import SuperTableRowSelect from "./controls/SuperTableRowSelect.svelte";
  import SuperTableWelcome from "./controls/SuperTableWelcome.svelte";
  import SuperTableSkeleton from "./controls/SuperTableSkeleton.svelte";

  // Imports from submodules
  import { SuperTableColumn } from "../../bb-component-SuperTableColumn/lib/SuperTableColumn/index.js"

  const { getAction, ActionTypes, builderStore } = getContext("sdk");

  export let tableOptions
  export let dataProvider

  let setSorting, setFiltering, unsetFiltering, sortedColumn, sortedDirection

  // Create Stores
  const tableDataStore = createSuperTableDataStore()
  const tableStateStore = createSuperTableStateStore()
  const tableFilterStore = createSuperTableFilterStore()
  const tableSelectionStore = new writable({})
  const tableDataChangesStore = new writable([])
  const tableEventStore = new writable({})

  const dispatch = createEventDispatcher();

  // Detect DataPovider changes
  $: if ( !(tableOptions.idColumn in dataProvider.schema) ) {
       if  ($builderStore.inBuilder ) {
          console.log("Mismatch in Builder")
          builderStore.actions.updateProp ("idColumn", null )
          tableOptions.idColumn = null
       }

  } 
  
  $: size = tableOptions.size
  // Initialize Store with appropriate row heights to avoid flicker when they load
  $: rowMinHeight = size != "custom" 
    ? sizingMap[size].rowMinHeight 
    : ( rowVerticalPadding * 2 ) + rowFontSize

  $: tableStateStore.setRowMinHeight(rowMinHeight)

  $: maxBodyHeight = tableOptions.visibleRowCount * $tableStateStore.rowHeights[0]

  
  // Get dataProvider sorting / filtering functions
  $: setSorting = getAction(
    dataProvider?.id,
    ActionTypes.SetDataProviderSorting
  );
  $: setFiltering = getAction(
    dataProvider?.id,
    ActionTypes.AddDataProviderQueryExtension
  );
  $: unsetFiltering = getAction(
    dataProvider?.id,
    ActionTypes.RemoveDataProviderQueryExtension
  );

  $: setDataProviderFiltering ( $tableFilterStore?.filters )
  $: setDataProviderSorting ( $tableDataStore?.sortColumn, $tableDataStore?.sortDirection)
  $: handleDataChange ( $tableDataChangesStore )
  $: handleRowClick( $tableStateStore.rowClicked )

  $: $tableDataStore._parentID = tableOptions.componentID
  $: $tableDataStore.idColumn = tableOptions.idColumn;

  setContext("tableDataStore", tableDataStore)
  setContext("tableDataChangesStore", tableDataChangesStore)
  setContext("tableStateStore", tableStateStore)
  setContext("tableFilterStore", tableFilterStore)
  setContext("tableSelectionStore", tableSelectionStore)

  // Component Function Definitions
  function setDataProviderFiltering( filters ) {
    if (filters.length > 0) {
      const queryExtension = LuceneUtils.buildLuceneQuery($tableFilterStore?.filters);
      setFiltering?.(tableOptions.componentID, queryExtension);
    } else {
      unsetFiltering?.(tableOptions.componentID);
    } 
  }

  function setDataProviderSorting(column, direction) {
    if ( (column != sortedColumn) || (direction != sortedDirection) ) 
    { 
      setSorting?.({ column: column, order: direction }) 
      sortedColumn = column
      sortedDirection = direction
    }
  }



  function handleRowSelect ( event ) {
    let context = {
      "rowID" : event.detail.rowID,
      "selectedRows": Object.keys($tableSelectionStore).filter( v => $tableSelectionStore[v] == true)
    }
    onRowSelect?.( context )
  }

  function handleDataChange ( changes )
  {
    let context = { dataChanges: changes }
    tableOptions.onDataChange?.( context )
  }

  function handleRowClick ( rowKey ) {
    if (rowKey) {
      let context = { rowID : rowKey }
      $tableStateStore.rowClicked = null;
      onRowClick?.( context )
    }
  }

  onMount( () => {
    $tableStateStore.loaded = true ; 
    $tableDataStore.loaded = true ; 
    $tableDataStore.data = dataProvider.rows
  })
</script>

<div 
  class="st-master-wrapper"
  style:--super-table-body-height={maxBodyHeight + "px"}
  style:--spectrum-table-row-background-color = {tableOptions.columnOptions.rowBackground}
>

  {#if !(tableOptions.columns.length < 1) }
    <div class="st-master-control"> 
      {#if tableOptions.rowSelection} <SuperTableRowSelect on:selectionChange={handleRowSelect}/> {/if} </div>
    <div class="st-master-columns"> 
      {#if tableOptions.superColumnsFirst} <slot /> {/if}
      {#each tableOptions.columns as column }
        <SuperTableColumn columnOptions={{...column, showFooter: tableOptions.showFooter }}/>
      {/each}
      {#if !tableOptions.superColumnsFirst} <slot /> {/if}
    </div>

    <div class="st-master-scroll">  <SuperTableVerticalScroller /> </div>
  {:else}
    <SuperTableWelcome />
  {/if}

</div>

<style>
  .st-master-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
  }

  .st-master-control {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
  }
  .st-master-columns {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    overflow-x: auto;
  }
</style>