/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TotesImport } from './routes/totes'
import { Route as ScanImport } from './routes/scan'
import { Route as IndexImport } from './routes/index'
import { Route as TotesToteIdImport } from './routes/totes_.$toteId'

// Create/Update Routes

const TotesRoute = TotesImport.update({
  id: '/totes',
  path: '/totes',
  getParentRoute: () => rootRoute,
} as any)

const ScanRoute = ScanImport.update({
  id: '/scan',
  path: '/scan',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TotesToteIdRoute = TotesToteIdImport.update({
  id: '/totes_/$toteId',
  path: '/totes/$toteId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/scan': {
      id: '/scan'
      path: '/scan'
      fullPath: '/scan'
      preLoaderRoute: typeof ScanImport
      parentRoute: typeof rootRoute
    }
    '/totes': {
      id: '/totes'
      path: '/totes'
      fullPath: '/totes'
      preLoaderRoute: typeof TotesImport
      parentRoute: typeof rootRoute
    }
    '/totes_/$toteId': {
      id: '/totes_/$toteId'
      path: '/totes/$toteId'
      fullPath: '/totes/$toteId'
      preLoaderRoute: typeof TotesToteIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/scan': typeof ScanRoute
  '/totes': typeof TotesRoute
  '/totes/$toteId': typeof TotesToteIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/scan': typeof ScanRoute
  '/totes': typeof TotesRoute
  '/totes/$toteId': typeof TotesToteIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/scan': typeof ScanRoute
  '/totes': typeof TotesRoute
  '/totes_/$toteId': typeof TotesToteIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/scan' | '/totes' | '/totes/$toteId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/scan' | '/totes' | '/totes/$toteId'
  id: '__root__' | '/' | '/scan' | '/totes' | '/totes_/$toteId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ScanRoute: typeof ScanRoute
  TotesRoute: typeof TotesRoute
  TotesToteIdRoute: typeof TotesToteIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ScanRoute: ScanRoute,
  TotesRoute: TotesRoute,
  TotesToteIdRoute: TotesToteIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/scan",
        "/totes",
        "/totes_/$toteId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/scan": {
      "filePath": "scan.tsx"
    },
    "/totes": {
      "filePath": "totes.tsx"
    },
    "/totes_/$toteId": {
      "filePath": "totes_.$toteId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
