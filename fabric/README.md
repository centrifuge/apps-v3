# fabric - Centrifuge Design System UI package

This package contains the implementation of the Centrifuge design system. It is home to:

- Color definitions
- Spacing units
- Icon components
- UI components (e.g. buttons, input controls, panels etc.)

## Getting started

To start using Fabric, install the package and its peer dependencies:

```bash
# yarn
yarn add @centrifuge/fabric react react-dom styled-components

# npm
npm install --save @centrifuge/fabric react react-dom styled-components

# pnpm
pnpm add --save @centrifuge/fabric react react-dom styled-components
```

If you have also forked the `app` repository, you can find the themeing configuration in [config](...app/src/config.ts) and provider implementation in [Root](../app/src/Root.tsx), otherwise you can import FabricProvider and use that in your project, which also includes the global styles

```jsx
import React from 'react'
import { FabricProvider } from '@centrifuge/fabric'

export function Root() {
  return (
    <>
      {...}
      <FabricProvider theme={theme}>
          {...router or children or other components}
      </FabricProvider>
    </>
  )
}```

## Development

### With Storybook

```sh
$ pnpm storybook
```

Will start the Storybook to allow development of the components in isolation

### Watch mode

```sh
$ pnpm build --watch
```

Will build locally and listen for changes, allowing to see the changes directly when working on `app`, for example

### Publishing a new version

Create a new branch and run `pnpm bump`, which bumps the package version, updates the changelog, creates a commit and tags it. Push the branch/tag, which should publish the version to NPM. Open a PR to merge the changes to `main`. For generating the changelog, make sure to use the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec in your commits, with `fabric` as the scope, e.g.: `feat(fabric): Add button component`
