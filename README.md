# Pixel Guardian

> A chrome extension that blocks NSFW images and reels from any website

## Features

-   Blocks NSFW images from any website
-   Hides reels
## Development

```bash
# install dependencies
yarn install

# build files to `/dist` directory
# HMR for extension pages and content scripts
yarn run dev
```

## Build

```bash
# build files to `/dist` directory
$ yarn run build
```

## Load unpacked extensions

[Getting Started Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `LOAD UNPACKED` button and select the `/dist` directory.
