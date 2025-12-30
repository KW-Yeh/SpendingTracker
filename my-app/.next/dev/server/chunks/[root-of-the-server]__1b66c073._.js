module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/utils/getAurora.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getDb",
    ()=>getDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$dsql$2d$signer$2f$dist$2d$es$2f$Signer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@aws-sdk/dsql-signer/dist-es/Signer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const { AURORA_DSQL_HOST, AURORA_DSQL_PORT, AURORA_DSQL_REGION, AURORA_DSQL_DB, AURORA_DSQL_USER } = process.env;
async function getPassword() {
    const signer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$aws$2d$sdk$2f$dsql$2d$signer$2f$dist$2d$es$2f$Signer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DsqlSigner"]({
        hostname: AURORA_DSQL_HOST,
        region: AURORA_DSQL_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    return await signer.getDbConnectAdminAuthToken();
}
async function getDb() {
    const password = await getPassword();
    const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Client"]({
        host: AURORA_DSQL_HOST,
        port: Number(AURORA_DSQL_PORT ?? 5432),
        user: AURORA_DSQL_USER,
        password,
        database: AURORA_DSQL_DB,
        ssl: {
            rejectUnauthorized: true
        }
    });
    await client.connect();
    return client;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/services/user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "deleteUser",
    ()=>deleteUser,
    "getUser",
    ()=>getUser,
    "putUser",
    ()=>putUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getAurora.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function getUser(email) {
    if (!email) {
        throw new Error('缺少 Email 資訊');
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const query = `
    SELECT 
      user_id,
      email,
      name,
      created_at
    FROM users
    WHERE email = $1
  `;
    const result = await db.query(query, [
        email
    ]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}
async function createUser(data) {
    const { user_id, email, name } = data;
    if (!user_id || !email) {
        throw new Error('缺少必要欄位');
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const query = `
    INSERT INTO users (user_id, email, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING user_id, email, name, created_at
  `;
    const result = await db.query(query, [
        user_id,
        email,
        name
    ]);
    if (result.rows.length === 0) {
        throw new Error('使用者 ID 已存在');
    }
    return result.rows[0];
}
async function putUser(userId, data) {
    if (!userId) {
        throw new Error('缺少使用者 ID');
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    // 動態建構 SET 子句
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.email !== undefined) {
        updates.push(`email = $${paramIndex}`);
        values.push(data.email);
        paramIndex++;
    }
    if (data.name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error('沒有要更新的欄位');
    }
    values.push(userId);
    const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE user_id = $${paramIndex}
    RETURNING user_id, email, name, created_at
  `;
    console.log('Executing query:', query);
    console.log('With values:', values);
    const result = await db.query(query, values);
    console.log('Query result:', result);
    if (result.rows.length === 0) {
        throw new Error('找不到該使用者');
    }
    return result.rows[0];
}
async function deleteUser(userId) {
    if (!userId) {
        throw new Error('缺少使用者 ID');
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getAurora$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    const query = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING user_id
  `;
    const result = await db.query(query, [
        userId
    ]);
    if (result.rows.length === 0) {
        throw new Error('找不到該使用者');
    }
    return result.rows[0];
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/aurora/user/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/user.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function PUT(req) {
    try {
        const body = await req.json();
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["putUser"])(body.user_id, body);
        return Response.json(result);
    } catch (error) {
        console.error(error);
        return Response.json({
            message: 'Internal Server Error'
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createUser"])(body);
        return Response.json(result);
    } catch (error) {
        console.error(error);
        return Response.json({
            message: 'Internal Server Error'
        });
    }
}
async function GET(req) {
    try {
        const url = new URL(req.url);
        const queryParams = url.searchParams;
        const id = queryParams.get('id');
        if (!id) return Response.json({
            message: 'Missing id'
        });
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUser"])(id);
        if (result) return Response.json(result);
        return Response.json({
            message: 'User not found'
        });
    } catch (error) {
        console.error(error);
        return Response.json({
            message: 'Internal Server Error'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b66c073._.js.map