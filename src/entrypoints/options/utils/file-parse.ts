export function parseDate(filename: string) {
  const m = filename.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z/);
  if (m) {
    const iso = m[0].replace(/^(\d{4}-\d{2}-\d{2}T)(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, '$1$2:$3:$4.$5Z');
    const date = new Date(iso);
    return date.toLocaleString();
  }

  console.error(`Filename ${filename} does not match expected format.`);
}

export function parseSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  while (size >= 1024 && units.length > 1) {
    size /= 1024;
    units.shift();
  }
  return `${size.toFixed(2)} ${units[0]}`;
}
