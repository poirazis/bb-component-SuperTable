import Wrapper from "./lib/Wrapper.svelte";
import schema from "./schema.json";
import pkg from "./package.json";

interface BudibasePlugin {
  Component: any;
  schema: any;
  version: string;
}

declare global {
  interface Window {
    "##BUDIBASE_CUSTOM_COMPONENTS##": BudibasePlugin[];
    registerCustomComponent?: (plugin: BudibasePlugin) => void;
  }
}

if (window) {
  const plugin: BudibasePlugin = {
    Component: Wrapper,
    schema,
    version: pkg.version,
  };
  if (!window["##BUDIBASE_CUSTOM_COMPONENTS##"]) {
    window["##BUDIBASE_CUSTOM_COMPONENTS##"] = [];
  }
  window["##BUDIBASE_CUSTOM_COMPONENTS##"].push(plugin);
  if (window.registerCustomComponent) {
    window.registerCustomComponent(plugin);
  }
}

export const Component = Wrapper;
export const version = pkg.version;
export { schema };
