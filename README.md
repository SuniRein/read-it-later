# Read It Later Simply

[English](./README.md) | [简体中文](./README.zh-CN.md)

A lightweight browser extension for saving web pages to read later—unlike other similar products,
this extension stores only basic page metadata, **not the full content**.

> Inspired by [in-my-pocket](https://github.com/pabuisson/in-my-pocket)

## Background

I have been using [Pocket](https://getpocket.com) to manage my reading list,
but Pocket will be [discontinued](https://support.mozilla.org/en-US/kb/future-of-pocket) after July 7, 2025.
While many alternatives exist, they often lack a convenient browser extension, and I primarily read directly in my browser.
Since my needs are simple and I don’t require full-page content storage, I decided to develop a tailored solution.

## Features

- **Lightweight**: Stores only essential page details (URL, title, favicon), keeping the extension fast and resource-efficient.
- **Quick Save**: Instantly add the current tab to your reading list with a single click.
- **User-Friendly UI**: Manage your list effortlessly with an intuitive interface.

## Installation

- [Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/read-it-later-simply/)

## Development

This extension is built with the [WXT framework](https://wxt.dev/).

1. Clone the repository

1. Install dependencies

    ```bash
    pnpm install
    ```

1. Load the extension in your browser

    ```bash
    pnpm run dev # Chrome
    pnpm run dev:firefox # Firefox
    ```

## License

This project is licensed under the [GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.en.html).
See the [LICENSE](./LICENSE) file for details.

