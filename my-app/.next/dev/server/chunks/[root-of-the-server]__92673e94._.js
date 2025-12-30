module.exports = [
"[externals]/node:async_hooks [external] (node:async_hooks, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_node:async_hooks_b485b2a4._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
    });
});
}),
"[project]/node_modules/@smithy/credential-provider-imds/dist-es/index.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[root-of-the-server]__a7fcb456._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/@smithy/credential-provider-imds/dist-es/index.js [app-route] (ecmascript)");
    });
});
}),
"[project]/node_modules/@smithy/core/dist-es/submodules/event-streams/index.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_@smithy_core_dist-es_submodules_event-streams_1c97e5c4._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/@smithy/core/dist-es/submodules/event-streams/index.js [app-route] (ecmascript)");
    });
});
}),
];