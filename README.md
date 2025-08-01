# Centrifuge Apps V3

A modern monorepo workspace using pnpm with multiple packages:

- `app`: A React application using React Router v7 in framework mode and Vite
- `derwa`: A react application using vite
- `launchpad`: A React application using React Router v7 in framework mode and Vite
- `functions`: A Nitro-powered API server
- `forms`: A package to reuse forms within our apps
- `shared`: A reusable package for our hooks and utils functions

## Quick Start

This project uses [pnpm](https://pnpm.io/) as its package manager.

```bash
# Install dependencies
pnpm install

# Start both app and API server concurrently
pnpm dev

# Or start individually:
pnpm dev:app      # Start app V3 only
pnpm dev:functions  # Start Nitro API server only
pnpm dev:derwa # Start derwa app only
pnpm dev:launchpad  # Start launchpad only
```

The React app will be available at: http://localhost:3001/ (or another available port)
The derwa app will be available at: http://localhost:3003/ (or another available port)
The launchpad app will be available at: http://localhost:3004/ (or another available port)
The API server will be available at: http://localhost:3002/ (as configured in functions/.env)

Sample API endpoint: http://localhost:3002/api/hello

## Architecture Decisions

### Monorepo Structure

This project uses a monorepo architecture with pnpm workspaces to manage multiple packages in a single repository. This approach provides several benefits:

1. **Code sharing**: Packages can easily share code and dependencies
2. **Single dependency tree**: Dependencies are hoisted to the root, reducing duplication
3. **Independent versioning**: Each package can be versioned independently
4. **Simplified development**: Development across packages is streamlined with a single repository

### Package Architecture

#### App Package

The `app & launchpad` package is a client-side React application built with:

- **React 18**
- **React Router v7 (framework mode)** For declarative routing
- **Vite**

Key architectural decisions:

1. **Framework Mode Routing**: Using React Router v7's framework mode which provides a more declarative and data-centric approach to routing. This involves:

   - Using the `createBrowserRouter` API instead of the older BrowserRouter component
   - Defining routes as a configuration object in a separate file
   - Using loaders and actions for data fetching and mutations
   - Using the `Outlet` component for nested routes

2. **Component Structure**:
   - `App.tsx`: The main layout component with navigation
   - `routes.tsx`: Centralized route configuration
   - `pages/`: Directory containing page components

#### Functions Package

The `functions` package provides the API layer using:

- **Nitro**: A fast and flexible server framework built on top of h3
- **h3**: A minimal HTTP server framework

Key architectural decisions:

1. **File-based Routing**: Nitro uses a file-based routing system where:

   - Files under `routes/` automatically become API endpoints
   - Directory structure maps directly to URL paths
   - `routes/api/hello.ts` => `/api/hello` endpoint

2. **TypeScript Support**: Full TypeScript support for type-safe API development

#### Centrifuge derwa

React app using vite

#### Styling and Props

We're using chakra UI, we have a defined theme within shakra, for more info consult chakra docs

### Communication Between Packages

- **API Communication**: The React app can communicate with the functions API using standard HTTP requests
- **Future Capabilities**: The fabric package could be used to share types, utilities, or components between the app and functions

## Development Workflow

### Running in Development Mode

To run the entire application in development mode:

```bash
# Terminal 1: Start the React app
pnpm --filter app dev

# Terminal 2: Start the API server
pnpm --filter functions dev
```

Both the React app and API server have hot module replacement (HMR) enabled for fast development.

### Building for Production

To build the packages for production:

```bash
# Build the React app
pnpm --filter app build

# Build the API server
pnpm --filter functions build
```

#### Testing

TBD
