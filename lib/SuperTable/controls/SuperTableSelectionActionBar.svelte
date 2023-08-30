<script>
  export let open
</script>

<div class="spectrum-ActionBar spectrum-ActionBar--sticky is-open">
  <div class="spectrum-Popover spectrum-ActionBar-popover is-open">
    <button class="spectrum-CloseButton spectrum-CloseButton--sizeM" aria-label="Clear selection">
      <svg class="spectrum-CloseButton-UIIcon spectrum-Icon spectrum-UIIcon-Cross100" focusable="false" aria-hidden="true">
        <use xlink:href="#spectrum-css-icon-Cross100" />
      </svg>
    </button>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="spectrum-FieldLabel spectrum-FieldLabel--sizeS">2 Selected</label>

    <div class="spectrum-ActionGroup">
      <button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet spectrum-ActionGroup-item">
        <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon" focusable="false" aria-label="Edit" aria-hidden="true">
          <use xlink:href="#spectrum-icon-18-Edit"></use>
        </svg>
        <span class="spectrum-ActionButton-label">Edit</span>
      </button>
      <button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet spectrum-ActionGroup-item">
        <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon" focusable="false" aria-label="Copy" aria-hidden="true">
          <use xlink:href="#spectrum-icon-18-Copy"></use>
        </svg>
        <span class="spectrum-ActionButton-label">Copy</span>
      </button>
      <button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet spectrum-ActionGroup-item">
        <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon" focusable="false" aria-label="Delete" aria-hidden="true">
          <use xlink:href="#spectrum-icon-18-Delete"></use>
        </svg>
        <span class="spectrum-ActionButton-label">Delete</span>
      </button>
    </div>
  </div>
</div>