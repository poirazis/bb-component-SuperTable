<script>
  import { getContext, setContext } from "svelte";
  import { get } from "svelte/store"
  import { LuceneUtils } from "./frontend-core"

  import { tableDataStore, tableFilterStore, tableStateStore } from "./lib/superTableStores"
  import { sizingMap } from "./lib/superTableThemes"

  import RowSelectColumn from "./lib/RowSelectColumn.svelte";
  import Scroller from "./lib/Scroller.svelte";
  import WelcomeWizard from "./lib/WelcomeWizard.svelte";

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

  let setSorting, setFiltering, unsetFiltering, sortedColumn, sortedDirection, activeFilters, isFiltered = false
  let loaded = false
  
  $: if ( !$loading ) { loaded = true; $tableDataStore.loaded = true ; }
  $: $tableDataStore.data = loaded && dataProvider?.rows?.length 
    ? dataProvider.rows 
    : new Array(dataProvider?.limit > 20 ? 20 : dataProvider?.limit ?? 12).fill({})
  
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

  $: $tableDataStore._parentID = $component?.id;
  $: $tableDataStore.idColumn = idColumn;

  // Keep store in synch with property updates or fallback to defaults
  $: $tableStateStore.size = size
  $: $tableStateStore.stylingOptions.headerAlign = headerAlign ? headerAlign : "flext-start"
  $: $tableStateStore.stylingOptions.headerFontColor = headerFontColor ? headerFontColor : "var(--spectrum-table-m-regular-header-text-color, var(--spectrum-alias-label-text-color))" 
  $: $tableStateStore.stylingOptions.headerBackground = headerBackground ? headerBackground : "var(--spectrum-table-m-regular-header-background-color, var(--spectrum-alias-label-text-color))" 
  $: $tableStateStore.stylingOptions.headerFontSize = size == "custom" ? headerFontSize : sizingMap[size].headerFontSize

  $: $tableStateStore.stylingOptions.rowVerticalAlign = rowVerticalAlign ?? $tableStateStore.stylingOptions.rowVerticalAlign
  $: $tableStateStore.stylingOptions.rowVerticalPadding = size == "custom" ? rowVerticalPadding : sizingMap[size].rowVerticalPadding
  $: $tableStateStore.stylingOptions.rowHorizontalAlign = rowHorizontalAlign ?? $tableStateStore.stylingOptions.rowHorizontalAlign
  $: $tableStateStore.stylingOptions.rowHorizontalPadding = size == "custom" ? rowHorizontalPadding : sizingMap[size].rowHorizontalPadding
  $: $tableStateStore.stylingOptions.rowFontSize =  size == "custom" ? rowFontSize : sizingMap[size].rowFontSize
  $: $tableStateStore.stylingOptions.rowFontColor = rowFontColor ? rowFontColor : "var(--spectrum-table-m-regular-cell-text-color, var(--spectrum-alias-text-color))"
  $: $tableStateStore.stylingOptions.rowBackground = rowBackground ? rowBackground : "var(--spectrum-table-m-regular-row-background-color)"

  $: $tableStateStore.stylingOptions.footerAlign = footerAlign ? footerAlign : "flext-start"
  $: $tableStateStore.stylingOptions.footerFontColor = footerFontColor ? footerFontColor : "var(--spectrum-table-m-regular-header-text-color, var(--spectrum-alias-label-text-color))"
  $: $tableStateStore.stylingOptions.footerBackground = footerBackground ? footerBackground : "transparent"

  $: $tableStateStore.stylingOptions.dividersColor = dividers != "none" ? dividersColor : "none"
  $: $tableStateStore.stylingOptions.dividers = dividers

  // Append Super Table Styling variables
  $: styles = {
    ...$component?.styles,
    normal: {
      ...$component?.styles.normal,
      ...generateStyling($tableStateStore),
    },
  };

  setContext("tableDataStore", tableDataStore)
  setContext("tableStateStore", tableStateStore)
  setContext("tableFilterStore", tableFilterStore)

  // Component Function Definitions
  function setDataProviderFiltering( filters ) {
    if (filters.length > 0) {
      const queryExtension = LuceneUtils.buildLuceneQuery($tableFilterStore?.filters);
      setFiltering?.($component.id, queryExtension);
    } else {
      unsetFiltering?.($component.id);
    } 
  }

  // Generate the variable overrides 
  function generateStyling() {
    let styles = {};
    // Table
    styles["--super-table-body-height"] = (visibleRowCount * ($tableStateStore.rowHeights[0] || sizingMap[size].rowMinHeight )) + "px"

    // Header
    styles["--spectrum-table-regular-header-text-size"] = $tableStateStore.stylingOptions.headerFontSize + "px"
    styles["--spectrum-table-m-regular-header-text-color"] = $tableStateStore.stylingOptions.headerFontColor
    styles["--spectrum-table-m-regular-header-background-color"] = $tableStateStore.stylingOptions.headerBackground
    styles["--spectrum-table-regular-header-padding-left"] = $tableStateStore.stylingOptions.rowHorizontalPadding + "px";

    styles["--super-table-header-horizontal-align"] = $tableStateStore.stylingOptions.headerAlign

    // Row 
    styles["--spectrum-table-m-regular-row-background-color"] = $tableStateStore.stylingOptions.rowBackground
    styles["--super-table-row-editor-font-size"] = $tableStateStore.stylingOptions.rowFontSize - 2 + "px"
    styles["--super-table-row-vertical-align"] = $tableStateStore.stylingOptions.rowVerticalAlign;
    styles["--super-table-row-horizontal-align"] = $tableStateStore.stylingOptions.rowHorizontalAlign;
    styles["--spectrum-table-regular-cell-text-size"] = $tableStateStore.stylingOptions.rowFontSize + "px";
    styles["--spectrum-table-m-regular-cell-text-color"] = $tableStateStore.stylingOptions.rowFontColor
    styles["--spectrum-table-regular-cell-padding-bottom"] = $tableStateStore.stylingOptions.rowVerticalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-top"] = $tableStateStore.stylingOptions.rowVerticalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-left"] = $tableStateStore.stylingOptions.rowHorizontalPadding + "px";
    styles["--spectrum-table-regular-cell-padding-right"] = $tableStateStore.stylingOptions.rowHorizontalPadding + "px";

    // Dividers 
    styles["--super-table-row-bottom-border-size"] = $tableStateStore.stylingOptions.dividers == "horizontal" ||  $tableStateStore.stylingOptions.dividers == "both" ? "1px" : "0px" 
    styles["--spectrum-table-m-regular-border-color"] = $tableStateStore.stylingOptions.dividersColor

    // Footer
    styles["--super-table-footer-horizontal-align"] = $tableStateStore.stylingOptions.footerAlign;
    styles["--super-table-footer-font-color"] = $tableStateStore.stylingOptions.footerFontColor;
    styles["--super-table-footer-background-color"] = $tableStateStore.stylingOptions.footerBackground;

    // Extra 
    styles["--spectrum-checkbox-m-box-size"] = $tableStateStore.stylingOptions.rowFontSize + "px"
    styles["--spectrum-checkbox-m-height"] = $tableStateStore.stylingOptions.rowFontSize + 2 + "px"
    return styles;
  }

  function setDataProviderSorting(column, direction) {
    if ( loaded && ((column != sortedColumn) || (direction != sortedDirection)) ) 
    { 
      setSorting?.({ column: column, order: direction }) 
      sortedColumn = column
      sortedDirection = direction
    }
  }

  function addNewColumn () {
    let subStore = $tableDataStore.columnStores[0]
    let store = get (subStore)
    builderStore.actions.duplicateComponent( store.columnID )
  }

  function handleRowSelect ( event ) {
    let context = {
      "rowID" : 1,
      "selectedRows": $tableDataStore.selectedRows
    }
    onRowSelect?.( context )
  }
</script>

<div class="st-master-wrapper" use:styleable={styles}>

  {#if !$component.empty}
    <div class="st-master-control"> {#if rowSelection} <RowSelectColumn /> {/if}</div>
    <div class="st-master-columns"> <slot /> </div>
    <div class="st-master-scroll"> <Scroller /> </div>
  {:else}
    <WelcomeWizard />
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