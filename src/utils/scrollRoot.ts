/** Get the scroll container. All scroll operations should use this
 *  instead of window to prevent Chrome mobile navbar auto-hide. */
export function getScrollRoot(): HTMLElement {
  return document.getElementById('scroll-root') || document.documentElement
}
