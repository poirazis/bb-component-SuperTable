<script>
  import { getContext, setContext } from "svelte";
  import { get } from "svelte/store"
  import { LuceneUtils } from "./frontend-core"

  import { tableDataStore, tableDataChangesStore, tableFilterStore, tableStateStore, tableThemeStore, tableSelectionStore } from "./lib/superTableStores"
  import { sizingMap } from "./lib/superTableThemes"

  import SuperTableVerticalScroller from "./lib/SuperTableVerticalScroller.svelte";
  import SuperTableRowSelect from "./lib/SuperTableRowSelect.svelte";
  import SuperTableWelcome from "./lib/SuperTableWelcome.svelte";
  import SuperTableSkeleton from "./lib/SuperTableSkeleton.svelte";

  const { styleable, getAction, ActionTypes, builderStore } = getContext("sdk");
  const component = getContext("component");
  const loading = getContext("loading");

  export let dataProvider 
  export let idColumn;
  export let visibleRowCount
  export let rowSelection;
  export let size;
  export let dividers, dividersColor;
  export let headerAlign, headerFontSize, headerFontColor, headerBackground
  export let rowVerticalAlign, rowHorizontalAlign, rowFontSize, rowFontColor, rowBackground
  export let footerAlign, footerFontSize, footerFontColor, footerBackground
  export let rowVerticalPadding, rowHorizontalPadding

  // Events
  export let onRowSelect
  export let onDataChange
  export let onRowClick

  let setSorting, setFiltering, unsetFiltering, sortedColumn, sortedDirection
  let loaded = false
  
  
  // Initialize Store with appropriate row heights to avoid flicker when they load
  let rowMinHeight = size != "custom" 
    ? sizingMap[size].rowMinHeight 
    : ( rowVerticalPadding * 2 ) + rowFontSize


  $tableStateStore.rowHeights = new Array(visibleRowCount).fill(rowMinHeight)
  $tableThemeStore.maxBodyHeight = visibleRowCount * rowMinHeight

  $: if ( !$loading ) {
       loaded = true; 
       $tableDataStore.loaded = true ; 
       $tableStateStore.loaded = true; 
       // Grab the new minHeight after loading as rows will adapt their size
       // Take it off the main thread to allow the row to render itself
       setTimeout( () => {  $tableThemeStore.maxBodyHeight = visibleRowCount * get(tableStateStore).rowHeights[0];}, 50); 
      }

  $: $tableDataStore.data = loaded 
    ? dataProvider?.rows 
    : new Array(visibleRowCount).fill({})
  
  $: if ( loaded ) $tableDataStore.dataSource = dataProvider?.datasource ?? {};
  $: if ( loaded ) $tableDataStore.schema = dataProvider?.schema ?? {};

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

  $: $tableDataStore._parentID = $component?.id;
  $: $tableDataStore.idColumn = idColumn;

  // Keep store in synch with property updates or fa  llback to defaults
  $: $tableThemeStore.size = size
  $: $tableThemeStore.headerAlign = headerAlign ? headerAlign : "flext-start"
  $: $tableThemeStore.headerFontColor = headerFontColor ? headerFontColor : "var(--spectrum-table-m-regular-header-text-color, var(--spectrum-alias-label-text-color))" 
  $: $tableThemeStore.headerBackground = headerBackground ? headerBackground : "var(--spectrum-table-m-regular-header-background-color, var(--spectrum-alias-label-text-color))" 
  $: $tableThemeStore.headerFontSize = size == "custom" ? headerFontSize : sizingMap[size].headerFontSize

  $: $tableThemeStore.rowVerticalAlign = rowVerticalAlign ?? $tableThemeStore.rowVerticalAlign
  $: $tableThemeStore.rowVerticalPadding = size == "custom" ? rowVerticalPadding : sizingMap[size].rowVerticalPadding
  $: $tableThemeStore.rowHorizontalAlign = rowHorizontalAlign ?? $tableThemeStore.rowHorizontalAlign
  $: $tableThemeStore.rowHorizontalPadding = size == "custom" ? rowHorizontalPadding : sizingMap[size].rowHorizontalPadding
  $: $tableThemeStore.rowFontSize =  size == "custom" ? rowFontSize : sizingMap[size].rowFontSize
  $: $tableThemeStore.rowFontColor = rowFontColor ? rowFontColor : "var(--spectrum-table-m-regular-cell-text-color, var(--spectrum-alias-text-color))"
  $: $tableThemeStore.rowBackground = rowBackground ? rowBackground : "var(--spectrum-table-m-regular-row-background-color)"

  $: $tableThemeStore.footerAlign = footerAlign ? footerAlign : "flext-start"
  $: $tableThemeStore.footerFontColor = footerFontColor ? footerFontColor : "var(--spectrum-table-m-regular-header-text-color, var(--spectrum-alias-label-text-color))"
  $: $tableThemeStore.footerBackground = footerBackground ? footerBackground : "transparent"

  $: $tableThemeStore.dividersColor = dividersColor ? dividersColor : "var(--spectrum-table-m-regular-border-color, var(--spectrum-alias-border-color-mid))"
  $: $tableThemeStore.dividers = dividers

  // Append Super Table Styling variables
  $: styles = {
    ...$component?.styles,
    normal: {
      ...$component?.styles.normal,
      ...generateStyling($tableThemeStore),
    },
  };

  setContext("tableDataStore", tableDataStore)
  setContext("tableDataChangesStore", tableDataChangesStore)
  setContext("tableStateStore", tableStateStore)
  setContext("tableFilterStore", tableFilterStore)
  setContext("tableSelectionStore", tableSelectionStore)

  // Component Function Definitions
  function setDataProviderFiltering( filters ) {
    if (filters.length > 0) {
      const queryExtension = LuceneUtils.buildLuceneQuery($tableFilterStore?.filters);
      setFiltering?.($component.id, queryExtension);
    } else {
      unsetFiltering?.($component.id);
    } 
  }

  function setDataProviderSorting(column, direction) {
    if ( loaded && ((column != sortedColumn) || (direction != sortedDirection)) ) 
    { 
      setSorting?.({ column: column, order: direction }) 
      sortedColumn = column
      sortedDirection = direction
    }
  }

  // Generate the variable overrides 
  function generateStyling() {
    let styles = {};
    // Table
    styles["--super-table-body-height"] =  $tableThemeStore.maxBodyHeight  + "px"

    // Header
    styles["--spectrum-table-regular-header-text-size"] = $tableThemeStore.headerFontSize + "px"
    styles["--spectrum-table-m-regular-header-text-color"] = $tableThemeStore.headerFontColor
    styles["--spectrum-table-m-regular-header-background-color"] = $tableThemeStore.headerBackground
    styles["--spectrum-table-regular-header-padding-left"] = $tableThemeStore.rowHorizontalPadding + "px";

    styles["--super-table-header-horizontal-align"] = $tableThemeStore.headerAlign

    // Row 
    styles["--spectrum-table-m-regular-row-background-color"] = $tableThemeStore.rowBackground
    styles["--super-table-row-editor-font-size"] = $tableThemeStore.rowFontSize - 2 + "px"
    styles["--super-table-row-vertical-align"] = $tableThemeStore.rowVerticalAlign;
    styles["--super-table-row-horizontal-align"] = $tableThemeStore.rowHorizontalAlign;
    styles["--spectrum-table-regular-cell-text-size"] = $tableThemeStore.rowFontSize + "px";
    styles["--spectrum-table-m-regular-cell-text-color"] = $tableThemeStore.rowFontColor
    styles["--spectrum-table-regular-cell-padding-bottom"] = $tableThemeStore.rowVerticalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-top"] = $tableThemeStore.rowVerticalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-left"] = $tableThemeStore.rowHorizontalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-right"] = $tableThemeStore.rowHorizontalPadding + "px";

    // Dividers 
    styles["--super-table-row-bottom-border-size"] = $tableThemeStore.dividers == "horizontal" ||  $tableThemeStore.dividers == "both" ? "1px" : "0px" 
    styles["--super-table-column-right-border-size"] = $tableThemeStore.dividers == "vertical" ||  $tableThemeStore.dividers == "both" ? "1px" : "0px" 
    styles["--spectrum-table-m-regular-border-color"] = $tableThemeStore.dividersColor

    // Footer
    styles["--super-table-footer-horizontal-align"] = $tableThemeStore.footerAlign;
    styles["--super-table-footer-font-color"] = $tableThemeStore.footerFontColor;
    styles["--super-table-footer-background-color"] = $tableThemeStore.footerBackground;

    // Extra 
    styles["--spectrum-checkbox-m-box-size"] = $tableThemeStore.rowFontSize + "px"
    styles["--spectrum-checkbox-m-height"] = $tableThemeStore.rowFontSize + 2 + "px"
    return styles;
  }

  function addNewColumn () {
    let subStore = $tableDataStore.columnStores[0]
    let store = get (subStore)
    builderStore.actions.duplicateComponent( store.columnID )
  }

  function handleRowSelect ( event ) {
    let context = {
      "rowID" : event.detail.rowID,
      "selectedRows": $tableSelectionStore
    }
    onRowSelect?.( context )
  }

  function handleDataChange ( changes )
  {
    let context = { dataChanges: changes }
    onDataChange?.( context )
  }

  function handleRowClick ( rowKey ) {
    if (rowKey) {
      let context = { rowID : rowKey }
      $tableStateStore.rowClicked = null;
      onRowClick?.( context )
    }
  }
</script>

<div class="st-master-wrapper" use:styleable={styles}>
  {#if !$component.empty && dataProvider}
    <div class="st-master-control"> {#if rowSelection} <SuperTableRowSelect on:selectionChange={handleRowSelect}/> {/if}</div>
    <div class="st-master-columns"> {#if $loading} <SuperTableSkeleton /> {:else} <slot /> {/if} </div>
    <div class="st-master-scroll"> {#if $tableDataStore.loaded } <SuperTableVerticalScroller /> {/if} </div>
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