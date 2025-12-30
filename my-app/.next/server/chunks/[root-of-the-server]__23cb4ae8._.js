module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},47661,e=>e.a(async(t,r)=>{try{var a=e.i(86174),s=t([a]);async function n(e){if(!e)throw Error("缺少群組 ID");let t=await (0,a.getDb)(),r=`
    SELECT
      a.account_id,
      a.name,
      a.owner_id,
      a.members,
      a.created_at,
      u.email as owner_email,
      u.name as owner_name,
      COUNT(DISTINCT am.user_id) as member_count
    FROM accounts a
    JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN account_members am ON a.account_id = am.account_id
    WHERE a.account_id = $1
    GROUP BY a.account_id, a.name, a.owner_id, a.members, a.created_at, u.email, u.name
  `,s=await t.query(r,[e]);if(0===s.rows.length)return null;let n=s.rows[0];return{...n,members:"string"==typeof n.members&&n.members?JSON.parse(n.members):n.members||[]}}async function o(e){if(!e)throw Error("缺少使用者 ID");let t=await (0,a.getDb)(),r=`
    SELECT
      a.account_id,
      a.name,
      a.owner_id,
      a.members,
      a.created_at,
      u.email as owner_email,
      u.name as owner_name,
      am.role as user_role,
      COUNT(DISTINCT am2.user_id) as member_count
    FROM account_members am
    JOIN accounts a ON am.account_id = a.account_id
    JOIN users u ON a.owner_id = u.user_id
    LEFT JOIN account_members am2 ON a.account_id = am2.account_id
    WHERE am.user_id = $1
    GROUP BY a.account_id, a.name, a.owner_id, a.members, a.created_at, u.email, u.name, am.role
    ORDER BY a.created_at DESC
  `;return(await t.query(r,[e])).rows.map(e=>({...e,members:"string"==typeof e.members&&e.members?JSON.parse(e.members):e.members||[]}))}async function i(e){let{account_id:t,name:r,owner_id:s}=e;if(!t||!r||!s)throw Error("缺少必要欄位");let n=await (0,a.getDb)();try{await n.query("BEGIN");let e=`
      INSERT INTO accounts (account_id, name, owner_id, members)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id, name, owner_id, members, created_at
    `,a=(await n.query(e,[t,r,s,JSON.stringify([s])])).rows[0];a.members&&(a.members="string"==typeof a.members?JSON.parse(a.members):a.members);let o=`
      INSERT INTO account_members (account_id, user_id, role)
      VALUES ($1, $2, 'Owner')
    `;return await n.query(o,[t,s]),await n.query("COMMIT"),a}catch(e){throw await n.query("ROLLBACK"),e}}async function u(e,t){if(!e)throw Error("缺少群組 ID");let r=await (0,a.getDb)(),s=[],n=[],o=1;if(void 0!==t.name&&(s.push(`name = $${o}`),n.push(t.name),o++),void 0!==t.owner_id&&(s.push(`owner_id = $${o}`),n.push(t.owner_id),o++),0===s.length)throw Error("沒有要更新的欄位");n.push(e);let i=`
    UPDATE accounts
    SET ${s.join(", ")}
    WHERE account_id = $${o}
    RETURNING account_id, name, owner_id, members, created_at
  `,u=await r.query(i,n);if(0===u.rows.length)throw Error("找不到該群組");let c=u.rows[0];return{...c,members:"string"==typeof c.members&&c.members?JSON.parse(c.members):c.members||[]}}async function c(e){if(!e)throw Error("缺少群組 ID");let t=await (0,a.getDb)();try{await t.query("BEGIN"),await t.query("DELETE FROM account_members WHERE account_id = $1",[e]);let r=`
      DELETE FROM accounts
      WHERE account_id = $1
      RETURNING account_id
    `,a=await t.query(r,[e]);if(0===a.rows.length)throw Error("找不到該群組");return await t.query("COMMIT"),a.rows[0]}catch(e){throw await t.query("ROLLBACK"),e}}async function l(e){if(!e)throw Error("缺少群組 ID");let t=await (0,a.getDb)(),r=`
    SELECT 
      am.account_id,
      am.user_id,
      am.role,
      am.joined_at,
      u.email,
      u.name
    FROM account_members am
    JOIN users u ON am.user_id = u.user_id
    WHERE am.account_id = $1
    ORDER BY 
      CASE am.role 
        WHEN 'Owner' THEN 1
        WHEN 'Editor' THEN 2
        WHEN 'Viewer' THEN 3
        ELSE 4
      END,
      am.joined_at ASC
  `;return(await t.query(r,[e])).rows}async function d(e){let{account_id:t,user_id:r,role:s}=e;if(!t||!r||!s)throw Error("缺少必要欄位");if(!["Owner","Editor","Viewer"].includes(s))throw Error("無效的角色");let n=await (0,a.getDb)(),o=`
    INSERT INTO account_members (account_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (account_id, user_id) 
    DO UPDATE SET role = EXCLUDED.role
    RETURNING account_id, user_id, role, joined_at
  `;return(await n.query(o,[t,r,s])).rows[0]}async function m(e,t){if(!e||!t)throw Error("缺少必要欄位");let r=await (0,a.getDb)(),s=`
    SELECT role FROM account_members
    WHERE account_id = $1 AND user_id = $2
  `,n=await r.query(s,[e,t]);if(n.rows.length>0&&"Owner"===n.rows[0].role)throw Error("無法移除群組擁有者");let o=`
    DELETE FROM account_members
    WHERE account_id = $1 AND user_id = $2
    RETURNING account_id, user_id
  `,i=await r.query(o,[e,t]);if(0===i.rows.length)throw Error("找不到該成員");return i.rows[0]}[a]=s.then?(await s)():s,e.s(["addGroupMember",()=>d,"createGroup",()=>i,"deleteGroup",()=>c,"getGroupById",()=>n,"getGroupMembers",()=>l,"getUserGroups",()=>o,"removeGroupMember",()=>m,"updateGroup",()=>u]),r()}catch(e){r(e)}},!1),69427,e=>e.a(async(t,r)=>{try{var a=e.i(86174),s=t([a]);async function n(e){if(!e)throw Error("缺少 Email 資訊");console.log("[DB getUser] Querying user with email:",e);let t=await (0,a.getDb)(),r=`
    SELECT
      user_id,
      email,
      name,
      avatar_url,
      created_at
    FROM users
    WHERE email = $1
  `,s=await t.query(r,[e]);return(console.log("[DB getUser] Query result rows:",s.rows.length),0===s.rows.length)?(console.log("[DB getUser] ⚠️ No user found for email:",e),null):(console.log("[DB getUser] ✅ User found:",s.rows[0]),s.rows[0])}async function o(e){let{user_id:t,email:r,name:s}=e;if(console.log("[DB createUser] Creating user with data:",{user_id:t,email:r,name:s}),!t||!r)throw Error("缺少必要欄位");let n=await (0,a.getDb)(),o=`
    INSERT INTO users (user_id, email, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING user_id, email, name, avatar_url, created_at
  `;console.log("[DB createUser] Executing INSERT query...");let i=await n.query(o,[t,r,s]);if(console.log("[DB createUser] Query result rows:",i.rows.length),0===i.rows.length)throw console.log("[DB createUser] ❌ User ID already exists:",t),Error("使用者 ID 已存在");return console.log("[DB createUser] ✅ User created successfully:",i.rows[0]),i.rows[0]}async function i(e,t){if(!e)throw Error("缺少使用者 ID");let r=await (0,a.getDb)(),s=[],n=[],o=1;if(void 0!==t.email&&(s.push(`email = $${o}`),n.push(t.email),o++),void 0!==t.name&&(s.push(`name = $${o}`),n.push(t.name),o++),void 0!==t.avatar_url&&(s.push(`avatar_url = $${o}`),n.push(t.avatar_url),o++),0===s.length)throw Error("沒有要更新的欄位");n.push(e);let i=`
    UPDATE users
    SET ${s.join(", ")}
    WHERE user_id = $${o}
    RETURNING user_id, email, name, avatar_url, created_at
  `;console.log("Executing query:",i),console.log("With values:",n);let u=await r.query(i,n);if(console.log("Query result:",u),0===u.rows.length)throw Error("找不到該使用者");return u.rows[0]}[a]=s.then?(await s)():s,e.s(["createUser",()=>o,"getUser",()=>n,"putUser",()=>i]),r()}catch(e){r(e)}},!1),11811,e=>e.a(async(t,r)=>{try{var a=e.i(86174),s=t([a]);async function n(e){let{groupId:t,email:r,startDate:s,endDate:n}=e;if(console.log("[DB getItems] Query params:",{groupId:t,email:r,startDate:s,endDate:n}),!t&&!r)throw Error("缺少群組 ID 或信箱資訊");let o=await (0,a.getDb)(),i=`
    SELECT 
      t.transaction_id as id,
      t.necessity,
      t."date",
      t.category,
      t.amount,
      t.description,
      t.type,
      t.account_id as "groupId",
      u.email as "user-token"
    FROM transactions t
    JOIN users u ON t.recorded_by_user_id = u.user_id
    WHERE 1=1
  `,u=[],c=1;t?(i+=` AND t.account_id = $${c}`,u.push(parseInt(t)),c++):r&&(i+=` AND u.email = $${c}`,u.push(r),c++),s&&(i+=` AND t."date" >= $${c}`,u.push(s),c++),n&&(i+=` AND t."date" <= $${c}`,u.push(n),c++),i+=' ORDER BY t."date" DESC',console.log("[DB getItems] Executing query with params:",u);let l=await o.query(i,u);return console.log("[DB getItems] ✅ Found",l.rows.length,"transactions"),l.rows}async function o(e){let{id:t,necessity:r,date:s,category:n,amount:o,description:i,type:u,groupId:c,"user-token":l}=e;if(!t||!r||!s||!o||!u)throw Error("缺少必要欄位");let d=await (0,a.getDb)(),m=1;if(l){let e=await d.query("SELECT user_id FROM users WHERE email = $1",[l]);e.rows.length>0&&(m=e.rows[0].user_id)}let p=`
    INSERT INTO transactions (
      transaction_id,
      account_id,
      recorded_by_user_id,
      necessity,
      "date",
      category,
      amount,
      description,
      type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (transaction_id) 
    DO UPDATE SET
      necessity = EXCLUDED.necessity,
      "date" = EXCLUDED."date",
      category = EXCLUDED.category,
      amount = EXCLUDED.amount,
      description = EXCLUDED.description,
      type = EXCLUDED.type
    RETURNING transaction_id as id
  `,E=[t,c||1,m,r,s,n,o,i,u];return(await d.query(p,E)).rows[0]}async function i(e){if(!e)throw Error("缺少項目 ID");let t=await (0,a.getDb)(),r=`
    DELETE FROM transactions 
    WHERE transaction_id = $1
    RETURNING transaction_id as id
  `,s=await t.query(r,[e]);if(0===s.rowCount)throw Error("找不到該項目");return s.rows[0]}[a]=s.then?(await s)():s,e.s(["deleteItem",()=>i,"getItems",()=>n,"putItem",()=>o]),r()}catch(e){r(e)}},!1),1510,e=>{"use strict";e.s(["FEATURE_FLAGS",0,{USE_OPTIMIZED_DASHBOARD:!0,USE_OPTIMIZED_BUDGET:!0,USE_OPTIMIZED_TRANSACTIONS:!0}])},80882,e=>e.a(async(t,r)=>{try{var a=e.i(86174),s=e.i(89171),n=e.i(1510),o=e.i(69427),i=e.i(47661),u=e.i(11811),c=t([a,o,i,u]);async function l(e){try{let t=new URL(e.url).searchParams.get("userId");if(!t)return s.NextResponse.json({status:!1,message:"Missing userId parameter"},{status:400});if(n.FEATURE_FLAGS.USE_OPTIMIZED_DASHBOARD)return await d(Number(t));return await m(Number(t))}catch(e){return console.error("[Dashboard API] Error:",e),s.NextResponse.json({status:!1,message:"Internal Server Error"},{status:500})}}async function d(e){let t=await (0,a.getPool)(),r=await t.query("SELECT get_user_dashboard_data($1) as data",[e]);if(!r.rows[0]?.data)return s.NextResponse.json({status:!1,message:"No data found"});let n="string"==typeof r.rows[0].data?JSON.parse(r.rows[0].data):r.rows[0].data;return s.NextResponse.json({status:!0,data:{user:n.user,groups:n.groups,recentTransactions:n.recent_transactions}})}async function m(e){let t=await (0,o.getUser)(String(e));if(!t)return s.NextResponse.json({status:!1,message:"User not found"});let r=await (0,i.getUserGroups)(e),a=r.map(e=>e.account_id),n=new Date;n.setDate(n.getDate()-30);let c=a.length>0?await (0,u.getItems)({groupId:a[0],startDate:n.toISOString().split("T")[0]}):[];return s.NextResponse.json({status:!0,data:{user:t,groups:r,recentTransactions:c.slice(0,50)}})}[a,o,i,u]=c.then?(await c)():c,e.s(["GET",()=>l]),r()}catch(e){r(e)}},!1),64798,e=>e.a(async(t,r)=>{try{var a=e.i(47909),s=e.i(74017),n=e.i(96250),o=e.i(59756),i=e.i(61916),u=e.i(14444),c=e.i(37092),l=e.i(69741),d=e.i(16795),m=e.i(87718),p=e.i(95169),E=e.i(47587),w=e.i(66012),_=e.i(70101),h=e.i(26937),g=e.i(10372),R=e.i(93695);e.i(52474);var y=e.i(220),f=e.i(80882),N=t([f]);[f]=N.then?(await N)():N;let T=new a.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/aurora/dashboard/route",pathname:"/api/aurora/dashboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/aurora/dashboard/route.ts",nextConfigOutput:"",userland:f}),{workAsyncStorage:v,workUnitAsyncStorage:O,serverHooks:I}=T;function D(){return(0,n.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:O})}async function b(e,t,r){T.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/aurora/dashboard/route";a=a.replace(/\/index$/,"")||"/";let n=await T.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:f,params:N,nextConfig:D,parsedUrl:b,isDraftMode:v,prerenderManifest:O,routerServerContext:I,isOnDemandRevalidate:x,revalidateOnlyGenerated:U,resolvedPathname:C,clientReferenceManifest:S,serverActionsManifest:$}=n,A=(0,l.normalizeAppPath)(a),q=!!(O.dynamicRoutes[A]||O.routes[C]),L=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,b,!1):t.end("This page could not be found"),null);if(q&&!v){let e=!!O.routes[C],t=O.dynamicRoutes[A];if(t&&!1===t.fallback&&!e){if(D.experimental.adapterPath)return await L();throw new R.NoFallbackError}}let P=null;!q||T.isDev||v||(P=C,P="/index"===P?"/":P);let H=!0===T.isDev||!q,M=q&&!H;$&&S&&(0,u.setReferenceManifestsSingleton)({page:a,clientReferenceManifest:S,serverActionsManifest:$,serverModuleMap:(0,c.createServerModuleMap)({serverActionsManifest:$})});let j=e.method||"GET",k=(0,i.getTracer)(),B=k.getActiveScopeSpan(),G={params:N,prerenderManifest:O,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:D.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>T.onRequestError(e,t,a,I)},sharedContext:{buildId:f}},F=new d.NodeNextRequest(e),W=new d.NodeNextResponse(t),J=m.NextRequestAdapter.fromNodeNextRequest(F,(0,m.signalFromNodeResponse)(t));try{let n=async e=>T.handle(J,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=k.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${j} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${j} ${a}`)}),u=!!(0,o.getRequestMeta)(e,"minimalMode"),c=async o=>{var i,c;let l=async({previousCacheEntry:s})=>{try{if(!u&&x&&U&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await n(o);e.fetchMetrics=G.renderOpts.fetchMetrics;let i=G.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let c=G.renderOpts.collectedTags;if(!q)return await (0,w.sendResponse)(F,W,a,G.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(a.headers);c&&(t[g.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,s=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:x})},I),t}},d=await T.handleResponse({req:e,nextConfig:D,cacheKey:P,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:U,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:u});if(!q)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});u||t.setHeader("x-nextjs-cache",x?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),v&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,_.fromNodeOutgoingHttpHeaders)(d.value.headers);return u&&q||m.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,w.sendResponse)(F,W,new Response(d.value.body,{headers:m,status:d.value.status||200})),null};B?await c(B):await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${a}`,kind:i.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},c))}catch(t){if(t instanceof R.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:A,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:x})}),q)throw t;return await (0,w.sendResponse)(F,W,new Response(null,{status:500})),null}}e.s(["handler",()=>b,"patchFetch",()=>D,"routeModule",()=>T,"serverHooks",()=>I,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>O]),r()}catch(e){r(e)}},!1),14277,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__56e7cf5d._.js"].map(t=>e.l(t))).then(()=>t(63152)))},93306,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__045059a3._.js","server/chunks/[root-of-the-server]__a1bc4740._.js"].map(t=>e.l(t))).then(()=>t(38788)))},14115,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__c1120e1e._.js"].map(t=>e.l(t))).then(()=>t(26709)))},9193,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__b378aca5._.js"].map(t=>e.l(t))).then(()=>t(1346)))},85365,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__b0b24298._.js"].map(t=>e.l(t))).then(()=>t(33073)))},52170,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__c6f768da._.js"].map(t=>e.l(t))).then(()=>t(23492)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__23cb4ae8._.js.map