import { createRouteMap } from "./create-route-map.js"

export function createMatcher(routes) {
    let {pathMap} = createRouteMap(routes)

    function addRoutes(routes) {
        return createRouteMap(routes, pathMap)
    }
    function addRoute(route) {
        return createRouteMap([route], pathMap)
    }
    function match(location) {
        return pathMap[location]
    }

    return {addRoutes, addRoute, match}
}
