<script>
  import { getContext, setContext, createEventDispatcher, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { dataFilters } from "@budibase/shared-core/";
  import {
    createSuperTableDataStore,
    createSuperTableFilterStore,
    createSuperTableStateStore,
  } from "./stores/superTableStores.js";

  import SuperTableVerticalScroller from "./controls/SuperTableVerticalScroller.svelte";
  import SuperTableRowSelect from "./controls/SuperTableRowSelect.svelte";
  import Popover from "../../node_modules/@budibase/bbui/src/Popover/Popover.svelte"
  import ClearButton from "../../node_modules/@budibase/bbui/src/ClearButton/ClearButton.svelte";
  import ActionButton from "../../node_modules/@budibase/bbui/src/ActionButton/ActionButton.svelte";
  import ActionGroup from "../../node_modules/@budibase/bbui/src/ActionGroup/ActionGroup.svelte";

  import fsm from "svelte-fsm";

  // Imports from submodules
  import { SuperTableColumn } from "../../bb-component-SuperTableColumn/lib/SuperTableColumn/index.js";

  const { getAction, ActionTypes } = getContext("sdk");

  const dispatch = createEventDispatcher();

  export let tableOptions;
  export let dataProvider;
  export let loading = false;

  let setSorting,
    setFiltering,
    unsetFiltering,
    sortedColumn,
    sortedDirection,
    filtered = false;

  let timer

  // Create Stores
  const tableDataStore = createSuperTableDataStore();
  const tableStateStore = createSuperTableStateStore();
  const tableFilterStore = createSuperTableFilterStore();
  const tableSelectionStore = new writable({});
  const tableDataChangesStore = new writable([]);
  const tableScrollPosition = new writable(0);
  const tableHoverStore = new writable(0);
  const tableOptionStore = new writable({});

  $: $tableOptionStore = tableOptions

  const tableState = fsm("Loading", {});

  // Static Assignments
  $tableStateStore.loaded = true;
  $tableDataStore.loaded = true;

  // Reactive Assignments
  $: superPowers = tableOptions.hasChildren;

  $: $tableDataStore.data = dataProvider?.rows ?? [];
  $: $tableDataStore.dataSource = dataProvider?.datasource ?? {};
  $: $tableDataStore.schema = dataProvider?.schema ?? {};

  $: $tableStateStore.rowCount = dataProvider.rows.length
    ? dataProvider.rows.length
    : tableOptions.visibleRowCount;

  // Initialize Store with appropriate row heights to avoid flicker when they load
  $: tableStateStore.setRowMinHeight(tableOptions.rowHeight);
  $: maxBodyHeight = tableOptions.visibleRowCount * $tableStateStore.rowHeights[0];

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

  $: refreshDP = getAction(dataProvider?.id, ActionTypes.RefreshDatasource )
  $: if ( tableOptions.autoRefresh && !timer ) 
    timer = setInterval ( () => ( refreshDataProvider() ), tableOptions.autoRefreshRate * 1000 )

  $: if ( timer && !tableOptions.autoRefresh ) clearInterval(timer)

  $: setDataProviderFiltering($tableFilterStore?.filters);
  $: setDataProviderSorting(
    $tableDataStore?.sortColumn,
    $tableDataStore?.sortDirection
  );
  $: handleDataChange($tableDataChangesStore);
  $: handleRowClick($tableStateStore.rowClicked);

  $: $tableDataStore._parentID = tableOptions.componentID;
  $: $tableDataStore.idColumn = tableOptions.idColumn;

  // Component Function Definitions
  function setDataProviderFiltering(filters) {
    if (filters.length > 0) {
      console.log("Setting Filters")
      const queryExtension = dataFilters.buildLuceneQuery(
        $tableFilterStore?.filters
      );
      setFiltering?.(tableOptions.componentID, queryExtension);
      filtered = true;
    } else if (filtered) {
      console.log("Clearing Filters")
      unsetFiltering?.(tableOptions.componentID);
      filtered = false;
    }
  }

  function setDataProviderSorting(column, direction) {
    if (column != sortedColumn || direction != sortedDirection) {
      setSorting?.({ column: column, order: direction });
      sortedColumn = column;
      sortedDirection = direction;
    }
  }

  function handleRowSelect(event) {
    let context = {
      rowID: event.detail.rowID,
      selectedRows: Object.keys($tableSelectionStore).filter(
        (v) => $tableSelectionStore[v] == true
      ),
    };
    tableOptions.onRowSelect?.(context);
  }

  function handleDataChange (changes) {
    if ( changes.length > 0 ) {
      let context = { ...changes[0] };
      tableOptions.onDataChange?.(context);
    }
  }

  function handleRowClick(rowKey) {
    if (rowKey) {
      let context = { rowID: rowKey };
      $tableStateStore.rowClicked = null;
      tableOptions?.events?.onRowClick?.(context);
    }
  }

  function refreshDataProvider() {
    $tableStateStore.refreshing = true;
    refreshDP();
    setTimeout( () => ($tableStateStore.refreshing = false) , 750 )
  }

  setContext("tableDataStore", tableDataStore);
  setContext("tableDataChangesStore", tableDataChangesStore);
  setContext("tableStateStore", tableStateStore);
  setContext("tableFilterStore", tableFilterStore);
  setContext("tableSelectionStore", tableSelectionStore);
  setContext("tableScrollPosition", tableScrollPosition);
  setContext("tableOptionStore", tableOptionStore);
  setContext("tableHoverStore", tableHoverStore);

  let anchor


</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={anchor}
  class="st-master-wrapper"
  class:refreshing={$tableStateStore.refreshing}
  style:--super-table-body-height={maxBodyHeight + "px"}
  style:--super-table-column-width={tableOptions.columnSizing == "fixed" ? tableOptions.columnWidth : null }
  style:--super-table-cell-padding={tableOptions.cellPadding + "px"}
  style:--super-table-vertical-dividers={tableOptions.dividers == "both" ||
  tableOptions.dividers == "vertical"
    ? "1px solid var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid))"
    : "none"}
>
  <div class="st-master-control" >
    {#if tableOptions.rowSelection}
      <SuperTableRowSelect on:selectionChange={handleRowSelect} />
    {/if}
  </div>
  
  
  <div class="st-master-columns" >

    {#if tableOptions.superColumnsPos == "first"} <slot /> {/if}

    {#each tableOptions?.columns as column (column.id) }
      <SuperTableColumn
        on:saveSettings
        columnOptions={{
          ...column,
          sizing: column.width ? "fixed" : tableOptions.columnSizing,
          width: column.width ? column.width : tableOptions.columnWidth,
          maxWidth: tableOptions.columnMaxWidth,
          showFooter: tableOptions.showFooter,
          hasChildren: false,
          canEdit: tableOptions.canEdit,
          canEdit: tableOptions.canEdit,
          canFilter: tableOptions.canFilter
        }}
      />
    {/each}

    {#if !(tableOptions.superColumnsPos == "first")} <slot /> {/if}
  </div>

  {#if $tableDataStore.data.length > tableOptions.visibleRowCount}
    <div class="st-master-scroll"><SuperTableVerticalScroller /></div>
  {/if}

</div>

  <Popover {anchor} dismissible={false} align={"left"} open={ Object.keys($tableSelectionStore).length > 0 && tableOptions.canDelete }>
    <div class="deleteMenu">
        <ClearButton />  
        <p class="spectrum-FieldLabel spectrum-FieldLabel--sizeS"> {Object.keys($tableSelectionStore).length} Selected </p>
    
        <ActionGroup>
          <ActionButton name="Delete" icon="Delete" size="S" quiet emphasized/>
        </ActionGroup>
      </div>
  </Popover>

<style>
  .st-master-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    transition: opacity 750ms ease-in-out;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .refreshing {
    filter: blur(10);
    opacity: 0.3;
  }
  .st-master-control {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
  }
  .st-master-columns {
    position: relative;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    overflow-x: auto;
    background-color: var(--spectrum-global-color-gray-50);
  }

  .st-master-scroll {
    opacity: 0.8;
  }

  .deleteMenu {
    width: 15rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
  }
  
</style>
