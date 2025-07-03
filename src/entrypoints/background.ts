import { defineBackground, browser } from '#imports';

export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
});
