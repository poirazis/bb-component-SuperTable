<script>
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { dataFilters } from "@budibase/shared-core/";
  import {
    createSuperTableDataStore,
    createSuperTableFilterStore,
    createSuperTableStateStore,
  } from "./stores/superTableStores.js";

  import SuperTableVerticalScroller from "./controls/SuperTableVerticalScroller.svelte";
  import SuperTableRowSelect from "./controls/SuperTableRowSelect.svelte";
  import fsm from "svelte-fsm";

  // Imports from submodules
  import { SuperTableColumn } from "../../bb-component-SuperTableColumn/lib/SuperTableColumn/index.js";

  const { getAction, ActionTypes } = getContext("sdk");

  export let tableOptions;
  export let dataProvider;
  export let loading = false;

  let setSorting,
    setFiltering,
    unsetFiltering,
    sortedColumn,
    sortedDirection,
    filtered = false;

  // Create Stores
  const tableDataStore = createSuperTableDataStore();
  const tableStateStore = createSuperTableStateStore();
  const tableFilterStore = createSuperTableFilterStore();
  const tableSelectionStore = new writable({});
  const tableDataChangesStore = new writable([]);
  const tableScrollPosition = new writable(0);
  const tableHoverStore = new writable(0);

  const tableState = fsm("Loading", {});

  // Static Assignments
  $tableStateStore.loaded = true;
  $tableDataStore.loaded = true;

  // Reactive Assignments
  $: superPowers = tableOptions.hasChildren;

  $: $tableDataStore.data = dataProvider.rows;
  $: $tableDataStore.dataSource = dataProvider.datasource;
  $: $tableDataStore.schema = dataProvider.schema;

  $: $tableStateStore.rowCount = dataProvider.rows.length
    ? dataProvider.rows.length
    : tableOptions.visibleRowCount;

  // Initialize Store with appropriate row heights to avoid flicker when they load
  $: tableStateStore.setRowMinHeight(tableOptions.rowHeight);
  $: maxBodyHeight =
    tableOptions.visibleRowCount * $tableStateStore.rowHeights[0];

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

  function handleDataChange(changes) {
    let context = { rowID: "dummy", dataChanges: changes };
    tableOptions.onDataChange?.(context);
  }

  function handleRowClick(rowKey) {
    if (rowKey) {
      let context = { rowID: rowKey };
      $tableStateStore.rowClicked = null;
      tableOptions?.events?.onRowClick?.(context);
    }
  }

  setContext("tableDataStore", tableDataStore);
  setContext("tableDataChangesStore", tableDataChangesStore);
  setContext("tableStateStore", tableStateStore);
  setContext("tableFilterStore", tableFilterStore);
  setContext("tableSelectionStore", tableSelectionStore);
  setContext("tableScrollPosition", tableScrollPosition);
  setContext("tableOptions", tableOptions);
  setContext("tableHoverStore", tableHoverStore);

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="st-master-wrapper"
  style:--super-table-body-height={maxBodyHeight + "px"}
  style:--super-table-cell-padding={tableOptions.cellPadding + "px"}
  style:--super-table-vertical-dividers={tableOptions.dividers == "both" ||
  tableOptions.dividers == "vertical"
    ? "1px solid var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid))"
    : "none"}
>
  <div class="st-master-control">
    {#if tableOptions.rowSelection}
      <SuperTableRowSelect on:selectionChange={handleRowSelect} />
    {/if}
  </div>
  <div class="st-master-columns">
    {#if tableOptions.superColumnsFirst} <slot /> {/if}
    {#each tableOptions.columns as column}
      <SuperTableColumn
        columnOptions={{
          ...column,
          hasChildren: false,
          filtering: tableOptions?.filtering,
          sorting: tableOptions?.sorting,
          editable: tableOptions.editable,
        }}
      />
    {/each}
    {#if !tableOptions.superColumnsFirst} <slot /> {/if}
  </div>

  {#if $tableDataStore.data.length > tableOptions.visibleRowCount}
    <div class="st-master-scroll"><SuperTableVerticalScroller /></div>
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

  .st-master-scroll {
    opacity: 1;
  }
</style>
