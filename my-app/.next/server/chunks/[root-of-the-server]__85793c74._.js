module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},75427,e=>e.a(async(t,r)=>{try{var a=e.i(86174),n=t([a]);async function s(e){if(!e)throw Error("缺少帳本 ID");let t=await (0,a.getDb)(),r=`
    SELECT
      budget_id,
      account_id,
      annual_budget,
      monthly_budget,
      monthly_items,
      created_at,
      updated_at
    FROM budgets
    WHERE account_id = $1
  `,n=await t.query(r,[Number(e)]);if(0===n.rows.length)return null;let s=n.rows[0];return{...s,monthly_items:"string"==typeof s.monthly_items?JSON.parse(s.monthly_items):s.monthly_items||[]}}async function o(e){let t,{budget_id:r,account_id:n,annual_budget:s,monthly_items:o}=e;if(!n||void 0===s||!Array.isArray(o))throw Error("缺少必要欄位");let i=new Date().getMonth()+1,u=o.reduce((e,t)=>{let r=t.months?.[i.toString()]||0;return e+r},0),l=await (0,a.getDb)(),d=JSON.stringify(o);if((await l.query("SELECT budget_id FROM budgets WHERE account_id = $1",[n])).rows.length>0){let e=`
      UPDATE budgets
      SET annual_budget = $1,
          monthly_budget = $2,
          monthly_items = $3,
          updated_at = NOW()
      WHERE account_id = $4
      RETURNING budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at
    `;t=await l.query(e,[s,u,d,n])}else{let e=r||Date.now(),a=`
      INSERT INTO budgets (
        budget_id,
        account_id,
        annual_budget,
        monthly_budget,
        monthly_items,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING budget_id, account_id, annual_budget, monthly_budget, monthly_items, created_at, updated_at
    `;t=await l.query(a,[e,n,s,u,d])}let c=t.rows[0];return{...c,monthly_items:"string"==typeof c.monthly_items?JSON.parse(c.monthly_items):c.monthly_items}}async function i(e){if(!e)throw Error("缺少帳本 ID");let t=await (0,a.getDb)(),r=`
    DELETE FROM budgets
    WHERE account_id = $1
    RETURNING account_id
  `,n=await t.query(r,[Number(e)]);if(0===n.rowCount)throw Error("找不到該預算");return n.rows[0]}[a]=n.then?(await n)():n,e.s(["deleteBudget",()=>i,"getBudget",()=>s,"putBudget",()=>o]),r()}catch(e){r(e)}},!1),11811,e=>e.a(async(t,r)=>{try{var a=e.i(86174),n=t([a]);async function s(e){let{groupId:t,email:r,startDate:n,endDate:s}=e;if(console.log("[DB getItems] Query params:",{groupId:t,email:r,startDate:n,endDate:s}),!t&&!r)throw Error("缺少群組 ID 或信箱資訊");let o=await (0,a.getDb)(),i=`
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
  `,u=[],l=1;t?(i+=` AND t.account_id = $${l}`,u.push(parseInt(t)),l++):r&&(i+=` AND u.email = $${l}`,u.push(r),l++),n&&(i+=` AND t."date" >= $${l}`,u.push(n),l++),s&&(i+=` AND t."date" <= $${l}`,u.push(s),l++),i+=' ORDER BY t."date" DESC',console.log("[DB getItems] Executing query with params:",u);let d=await o.query(i,u);return console.log("[DB getItems] ✅ Found",d.rows.length,"transactions"),d.rows}async function o(e){let{id:t,necessity:r,date:n,category:s,amount:o,description:i,type:u,groupId:l,"user-token":d}=e;if(!t||!r||!n||!o||!u)throw Error("缺少必要欄位");let c=await (0,a.getDb)(),p=1;if(d){let e=await c.query("SELECT user_id FROM users WHERE email = $1",[d]);e.rows.length>0&&(p=e.rows[0].user_id)}let h=`
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
  `,g=[t,l||1,p,r,n,s,o,i,u];return(await c.query(h,g)).rows[0]}async function i(e){if(!e)throw Error("缺少項目 ID");let t=await (0,a.getDb)(),r=`
    DELETE FROM transactions 
    WHERE transaction_id = $1
    RETURNING transaction_id as id
  `,n=await t.query(r,[e]);if(0===n.rowCount)throw Error("找不到該項目");return n.rows[0]}[a]=n.then?(await n)():n,e.s(["deleteItem",()=>i,"getItems",()=>s,"putItem",()=>o]),r()}catch(e){r(e)}},!1),1510,e=>{"use strict";e.s(["FEATURE_FLAGS",0,{USE_OPTIMIZED_DASHBOARD:!0,USE_OPTIMIZED_BUDGET:!0,USE_OPTIMIZED_TRANSACTIONS:!0}])},95201,e=>e.a(async(t,r)=>{try{var a=e.i(86174),n=e.i(89171),s=e.i(1510),o=e.i(75427),i=e.i(11811),u=t([a,o,i]);async function l(e){try{let t=new URL(e.url).searchParams,r=t.get("accountId"),a=t.get("year");if(!r)return n.NextResponse.json({status:!1,message:"Missing accountId parameter"},{status:400});if(s.FEATURE_FLAGS.USE_OPTIMIZED_BUDGET)return await d(Number(r),a?Number(a):void 0);return await c(Number(r),a?Number(a):void 0)}catch(e){return console.error("[Budget Page API] Error:",e),n.NextResponse.json({status:!1,message:"Internal Server Error"},{status:500})}}async function d(e,t){let r=await (0,a.getPool)(),s=t?await r.query("SELECT get_budget_page_data($1, $2) as data",[e,t]):await r.query("SELECT get_budget_page_data($1) as data",[e]);if(!s.rows[0]?.data)return n.NextResponse.json({status:!1,message:"No data found"});let o="string"==typeof s.rows[0].data?JSON.parse(s.rows[0].data):s.rows[0].data;return n.NextResponse.json({status:!0,data:{budget:o.budget,yearlyTransactions:o.yearly_transactions,monthlyStatistics:o.monthly_statistics}})}async function c(e,t){let r=t||new Date().getFullYear(),a=await (0,o.getBudget)(e),s=`${r}-01-01`,u=`${r}-12-31`,l=await (0,i.getItems)({groupId:String(e),startDate:s,endDate:u}),d={};for(let e=1;e<=12;e++){let t=l.filter(t=>{let a=new Date(t.date);return a.getFullYear()===r&&a.getMonth()+1===e});d[e]={total_outcome:t.filter(e=>"Outcome"===e.type).reduce((e,t)=>e+Number(t.amount),0),total_income:t.filter(e=>"Income"===e.type).reduce((e,t)=>e+Number(t.amount),0),transaction_count:t.length}}return n.NextResponse.json({status:!0,data:{budget:a,yearlyTransactions:l,monthlyStatistics:d}})}[a,o,i]=u.then?(await u)():u,e.s(["GET",()=>l]),r()}catch(e){r(e)}},!1),84241,e=>e.a(async(t,r)=>{try{var a=e.i(47909),n=e.i(74017),s=e.i(96250),o=e.i(59756),i=e.i(61916),u=e.i(14444),l=e.i(37092),d=e.i(69741),c=e.i(16795),p=e.i(87718),h=e.i(95169),g=e.i(47587),E=e.i(66012),_=e.i(70101),m=e.i(26937),y=e.i(10372),w=e.i(93695);e.i(52474);var R=e.i(220),f=e.i(95201),v=t([f]);[f]=v.then?(await v)():v;let N=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/aurora/budget-page/route",pathname:"/api/aurora/budget-page",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/aurora/budget-page/route.ts",nextConfigOutput:"",userland:f}),{workAsyncStorage:D,workUnitAsyncStorage:T,serverHooks:I}=N;function b(){return(0,s.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:T})}async function x(e,t,r){N.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/aurora/budget-page/route";a=a.replace(/\/index$/,"")||"/";let s=await N.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:f,params:v,nextConfig:b,parsedUrl:x,isDraftMode:D,prerenderManifest:T,routerServerContext:I,isOnDemandRevalidate:C,revalidateOnlyGenerated:S,resolvedPathname:O,clientReferenceManifest:A,serverActionsManifest:$}=s,U=(0,d.normalizeAppPath)(a),P=!!(T.dynamicRoutes[U]||T.routes[O]),q=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,x,!1):t.end("This page could not be found"),null);if(P&&!D){let e=!!T.routes[O],t=T.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await q();throw new w.NoFallbackError}}let k=null;!P||N.isDev||D||(k=O,k="/index"===k?"/":k);let j=!0===N.isDev||!P,M=P&&!j;$&&A&&(0,u.setReferenceManifestsSingleton)({page:a,clientReferenceManifest:A,serverActionsManifest:$,serverModuleMap:(0,l.createServerModuleMap)({serverActionsManifest:$})});let H=e.method||"GET",L=(0,i.getTracer)(),F=L.getActiveScopeSpan(),B={params:v,prerenderManifest:T,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>N.onRequestError(e,t,a,I)},sharedContext:{buildId:f}},G=new c.NodeNextRequest(e),W=new c.NodeNextResponse(t),X=p.NextRequestAdapter.fromNodeNextRequest(G,(0,p.signalFromNodeResponse)(t));try{let s=async e=>N.handle(X,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=L.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==h.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${a}`)}),u=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var i,l;let d=async({previousCacheEntry:n})=>{try{if(!u&&C&&S&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(o);e.fetchMetrics=B.renderOpts.fetchMetrics;let i=B.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let l=B.renderOpts.collectedTags;if(!P)return await (0,E.sendResponse)(G,W,a,B.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[y.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:C})},I),t}},c=await N.handleResponse({req:e,nextConfig:b,cacheKey:k,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:S,responseGenerator:d,waitUntil:r.waitUntil,isMinimalMode:u});if(!P)return null;if((null==c||null==(i=c.value)?void 0:i.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});u||t.setHeader("x-nextjs-cache",C?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(c.value.headers);return u&&P||p.delete(y.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,m.getCacheControlHeader)(c.cacheControl)),await (0,E.sendResponse)(G,W,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};F?await l(F):await L.withPropagatedContext(e.headers,()=>L.trace(h.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:i.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof w.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:C})}),P)throw t;return await (0,E.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",()=>x,"patchFetch",()=>b,"routeModule",()=>N,"serverHooks",()=>I,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>T]),r()}catch(e){r(e)}},!1),14277,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__56e7cf5d._.js"].map(t=>e.l(t))).then(()=>t(63152)))},93306,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__045059a3._.js","server/chunks/[root-of-the-server]__a1bc4740._.js"].map(t=>e.l(t))).then(()=>t(38788)))},14115,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__c1120e1e._.js"].map(t=>e.l(t))).then(()=>t(26709)))},9193,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__b378aca5._.js"].map(t=>e.l(t))).then(()=>t(1346)))},85365,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__b0b24298._.js"].map(t=>e.l(t))).then(()=>t(33073)))},52170,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__c6f768da._.js"].map(t=>e.l(t))).then(()=>t(23492)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__85793c74._.js.map