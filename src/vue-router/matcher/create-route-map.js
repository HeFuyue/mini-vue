export function createRouteMap(routes, pathMap) {
    pathMap = pathMap || {}

    routes.forEach(route => {
        addRouteRecord(route, pathMap)
    })

    return {
        pathMap
    }
}

function addRouteRecord(route, pathMap, parentRecord) {
    let path = parentRecord ? `${parentRecord.path === '/' ? '' : parentRecord.path}/${route.path}` : route.path

    let record = {
        path,
        component: route.component,
        name: route.name,
        props: route.props,
        meta: route.meta,
        parent: parentRecord
    }

    if (!pathMap[path]) {
        pathMap[path] = record
    }

    if (route.children) {
        route.children.forEach(child => {
            addRouteRecord(child, pathMap, record)
        })
    }
}
