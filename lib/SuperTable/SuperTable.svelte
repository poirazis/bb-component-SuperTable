<script>
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  import fsm from "svelte-fsm";
  import { dataFilters } from "@budibase/shared-core/";
  import {
    createSuperTableDataStore,
    createSuperTableFilterStore,
    createSuperTableStateStore,
  } from "./stores/superTableStores.js";

  import SuperTableVerticalScroller from "./controls/SuperTableVerticalScroller.svelte";
  import SuperTableRowSelect from "./controls/SuperTableRowSelect.svelte";
  import { SuperTableColumn } from "../../bb-component-SuperTableColumn/lib/SuperTableColumn/index.js";

  const { getAction, ActionTypes } = getContext("sdk");

  export let tableOptions = {}
  export let tableColumns = []
  export let tableTheme = {}
  export let dataProvider = {};
  export let inBuilder = false

  let setSorting,
    setFiltering,
    unsetFiltering,
    sortedColumn,
    sortedDirection,
    filtered = false;

  let timer
  let anchor
  let columnStates = [];

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

  const tableState = fsm("Idle", {
    "*" : {
      refresh() { return "Loading" },
      applyFilter( filterObj ) {
        console.log(filterObj)
        tableFilterStore?.setFilter(filterObj) 
      },
      setFilter( filterObj ) { 
        this.applyFilter.debounce( 750, filterObj)
      },
      clearFilter() { return "Idle" },
      setSorting() { return "Sorted" },
      registerColumn() {},
      unregisterColumn() {},
      exportData() {},
      deleteRow() {},
      addRow() {},
      selectRow() {},
      unselectRow() {},
      editCell() {},
      setState( state ) { return state } 
    },
    Idle: { 
      filtering: "Loading",
     },
    Loading: { 
      _enter() { this.loaded.debounce(500) }, 
      loaded: "Idle"
    },
    Filtered: { },
    Sorted: { },
    Empty: { }
  });

  // Static Assignments
  $tableStateStore.loaded = true;
  $tableDataStore.loaded = true;

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

  setContext("tableState", tableState);

  $: console.log("Super Table State :", $tableState)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={anchor}
  class="st-master-wrapper"
  class:refreshing={$tableStateStore.refreshing}
  style:--super-table-footer-height={"2.5rem"}
  style:--super-table-body-height={maxBodyHeight + "px"}
  style:--super-table-header-color={tableTheme.headerColor}
  style:--super-table-header-bg-color={tableTheme.headerBgColor}
  style:--super-table-color={tableTheme.tableColor}
  style:--super-table-bg-color={tableTheme.tableBgColor}
  style:--super-table-footer-color={tableTheme.footerColor}
  style:--super-table-footer-bg-color={tableTheme.footerBgColor}
  style:--super-table-relItem-color={tableTheme.relationshipItemColor}
  style:--super-table-relItem-bg-color={tableTheme.relationshipItemBgColor}
  style:--super-table-column-width={tableOptions.columnSizing == "fixed" ? tableOptions.columnWidth : null }
  style:--super-table-cell-padding={tableOptions.cellPadding + "px"}
  style:--super-table-vertical-dividers={tableOptions.dividers == "both" ||
  tableOptions.dividers == "vertical"
    ? "1px solid var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid))"
    : "none"}
>
  <div class="st-master-control" >
    {#if tableOptions.rowSelection}
      <SuperTableRowSelect {tableState} {tableOptions} />
    {/if}
  </div>
  
  
  <div class="st-master-columns" >

    {#if tableOptions.superColumnsPos == "first"} <slot /> {/if}

    {#each tableColumns as columnOptions, idx }
      <SuperTableColumn
        on:saveSettings
        bind:columnState={ columnStates[idx] }
        {tableState}
        {tableOptions}
        {columnOptions}
      />
    {/each}

    {#if tableOptions.superColumnsPos != "first"} <slot /> {/if}

  </div>

  {#if $tableDataStore.data.length > tableOptions.visibleRowCount}
    <div class="st-master-scroll"> <SuperTableVerticalScroller {tableOptions} /></div>
  {/if}
</div>

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
    opacity: 0.75;
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
    background-color: transparent;
  }

  .st-master-scroll {
    background-color: transparent;
  }
  
</style>
