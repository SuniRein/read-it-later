export function getFaviconUrl(url: string): string {
    const parsedUrl = new URL(url);
    return `https://favicon.im/${parsedUrl.hostname}?larger=true`;
}
