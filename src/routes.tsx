import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { TaskList } from "./templates";
import { Header } from "./components/header/header";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const dndKitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div>Home</div>,
});

const reactDndRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/task-list",
  component: () => <TaskList />,
});

const routeTree = rootRoute.addChildren([dndKitRoute, reactDndRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
