/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const SignupLazyImport = createFileRoute('/signup')()
const SigninLazyImport = createFileRoute('/signin')()

// Create/Update Routes

const SignupLazyRoute = SignupLazyImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/signup.lazy').then((d) => d.Route))

const SigninLazyRoute = SigninLazyImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/signin.lazy').then((d) => d.Route))

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
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
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/signin': {
      id: '/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof SigninLazyImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/signin': typeof SigninLazyRoute
  '/signup': typeof SignupLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/signin': typeof SigninLazyRoute
  '/signup': typeof SignupLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/signin': typeof SigninLazyRoute
  '/signup': typeof SignupLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/settings' | '/signin' | '/signup'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/settings' | '/signin' | '/signup'
  id: '__root__' | '/' | '/about' | '/settings' | '/signin' | '/signup'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  SettingsRoute: typeof SettingsRoute
  SigninLazyRoute: typeof SigninLazyRoute
  SignupLazyRoute: typeof SignupLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  SettingsRoute: SettingsRoute,
  SigninLazyRoute: SigninLazyRoute,
  SignupLazyRoute: SignupLazyRoute,
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
        "/about",
        "/settings",
        "/signin",
        "/signup"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/signin": {
      "filePath": "signin.lazy.tsx"
    },
    "/signup": {
      "filePath": "signup.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
