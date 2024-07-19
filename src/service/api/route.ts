import { request } from '../request';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: '/route/get-constant-routes' });
}

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/get-user-routes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ url: '/route/isRouteExist', params: { routeName } });
}
