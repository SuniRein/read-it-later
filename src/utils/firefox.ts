export function isFirefox(): boolean {
  return (globalThis as any).browser?.runtime?.id !== undefined;
}

/**
 * Firefox restricts creating these URLs for security reasons
 */
export function urlRestricted(url: string): boolean {
  /// keep-sorted
  const restrictedProtocols = [
    'about',
    'chrome',
    'data',
    'file',
    'javascript',
  ];

  const protocol = new URL(url).protocol.slice(0, -1); // remove trailing ':'
  return restrictedProtocols.includes(protocol);
}
