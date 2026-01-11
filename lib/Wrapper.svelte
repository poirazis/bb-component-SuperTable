<script>
  import Component from "../src/Component.svelte"
</script>

<svelte:boundary>
  <Component {...$$restProps}>
    <slot />
  </Component>
  {#snippet failed(error, reset)}
    <div class="plugin-error">Component failed to render: {error?.message}</div>
  {/snippet}
</svelte:boundary>

<style>
  .plugin-error { color: var(--spectrum-global-color-red-500); font-size: 0.9em }
  .plugin-error:empty { display: none }
</style>
