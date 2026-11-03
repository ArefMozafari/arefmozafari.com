import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

let container: AstroContainer | undefined;

/// Renders an Astro component to an HTML string with a shared container.
export async function render(
  component: AstroComponentFactory,
  props: Record<string, unknown> = {},
): Promise<string> {
  container ??= await AstroContainer.create();
  return container.renderToString(component, { props });
}
