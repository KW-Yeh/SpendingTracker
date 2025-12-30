module.exports=[18622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,r,t)=>{r.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},47661,e=>e.a(async(r,t)=>{try{var a=e.i(86174),n=r([a]);async function o(e){if(!e)throw Error("缺少群組 ID");let r=await (0,a.getDb)(),t=`
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
  `,n=await r.query(t,[e]);if(0===n.rows.length)return null;let o=n.rows[0];return{...o,members:"string"==typeof o.members&&o.members?JSON.parse(o.members):o.members||[]}}async function s(e){if(!e)throw Error("缺少使用者 ID");let r=await (0,a.getDb)(),t=`
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
  `;return(await r.query(t,[e])).rows.map(e=>({...e,members:"string"==typeof e.members&&e.members?JSON.parse(e.members):e.members||[]}))}async function i(e){let{account_id:r,name:t,owner_id:n}=e;if(!r||!t||!n)throw Error("缺少必要欄位");let o=await (0,a.getDb)();try{await o.query("BEGIN");let e=`
      INSERT INTO accounts (account_id, name, owner_id, members)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id, name, owner_id, members, created_at
    `,a=(await o.query(e,[r,t,n,JSON.stringify([n])])).rows[0];a.members&&(a.members="string"==typeof a.members?JSON.parse(a.members):a.members);let s=`
      INSERT INTO account_members (account_id, user_id, role)
      VALUES ($1, $2, 'Owner')
    `;return await o.query(s,[r,n]),await o.query("COMMIT"),a}catch(e){throw await o.query("ROLLBACK"),e}}async function u(e,r){if(!e)throw Error("缺少群組 ID");let t=await (0,a.getDb)(),n=[],o=[],s=1;if(void 0!==r.name&&(n.push(`name = $${s}`),o.push(r.name),s++),void 0!==r.owner_id&&(n.push(`owner_id = $${s}`),o.push(r.owner_id),s++),0===n.length)throw Error("沒有要更新的欄位");o.push(e);let i=`
    UPDATE accounts
    SET ${n.join(", ")}
    WHERE account_id = $${s}
    RETURNING account_id, name, owner_id, members, created_at
  `,u=await t.query(i,o);if(0===u.rows.length)throw Error("找不到該群組");let c=u.rows[0];return{...c,members:"string"==typeof c.members&&c.members?JSON.parse(c.members):c.members||[]}}async function c(e){if(!e)throw Error("缺少群組 ID");let r=await (0,a.getDb)();try{await r.query("BEGIN"),await r.query("DELETE FROM account_members WHERE account_id = $1",[e]);let t=`
      DELETE FROM accounts
      WHERE account_id = $1
      RETURNING account_id
    `,a=await r.query(t,[e]);if(0===a.rows.length)throw Error("找不到該群組");return await r.query("COMMIT"),a.rows[0]}catch(e){throw await r.query("ROLLBACK"),e}}async function l(e){if(!e)throw Error("缺少群組 ID");let r=await (0,a.getDb)(),t=`
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
  `;return(await r.query(t,[e])).rows}async function d(e){let{account_id:r,user_id:t,role:n}=e;if(!r||!t||!n)throw Error("缺少必要欄位");if(!["Owner","Editor","Viewer"].includes(n))throw Error("無效的角色");let o=await (0,a.getDb)(),s=`
    INSERT INTO account_members (account_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (account_id, user_id) 
    DO UPDATE SET role = EXCLUDED.role
    RETURNING account_id, user_id, role, joined_at
  `;return(await o.query(s,[r,t,n])).rows[0]}async function m(e,r){if(!e||!r)throw Error("缺少必要欄位");let t=await (0,a.getDb)(),n=`
    SELECT role FROM account_members
    WHERE account_id = $1 AND user_id = $2
  `,o=await t.query(n,[e,r]);if(o.rows.length>0&&"Owner"===o.rows[0].role)throw Error("無法移除群組擁有者");let s=`
    DELETE FROM account_members
    WHERE account_id = $1 AND user_id = $2
    RETURNING account_id, user_id
  `,i=await t.query(s,[e,r]);if(0===i.rows.length)throw Error("找不到該成員");return i.rows[0]}[a]=n.then?(await n)():n,e.s(["addGroupMember",()=>d,"createGroup",()=>i,"deleteGroup",()=>c,"getGroupById",()=>o,"getGroupMembers",()=>l,"getUserGroups",()=>s,"removeGroupMember",()=>m,"updateGroup",()=>u]),t()}catch(e){t(e)}},!1),21427,e=>e.a(async(r,t)=>{try{var a=e.i(47661),n=r([a]);async function o(e){try{let r=await e.json(),t=await (0,a.updateGroup)(r.account_id,r);return Response.json(t)}catch(e){return console.error(e),Response.json({message:"Internal Server Error"})}}async function s(e){try{let r=await e.json(),t=await (0,a.createGroup)(r);return Response.json(t)}catch(e){return console.error(e),Response.json({message:"Internal Server Error"})}}async function i(e){try{let r,t=new URL(e.url).searchParams,n=t.get("id"),o=t.get("type");if(!n)return Response.json({message:"缺少 ID 參數"},{status:400});if("single"===o){let e=await (0,a.getGroupById)(Number(n));r=e?[e]:[]}else r=await (0,a.getUserGroups)(Number(n));return Response.json(r)}catch(e){return console.error(e),Response.json({message:"Internal Server Error"})}}async function u(e){try{let r=new URL(e.url).searchParams.get("id"),t=await (0,a.deleteGroup)(Number(r));return Response.json(t)}catch(e){return console.error(e),Response.json({message:"Internal Server Error"})}}[a]=n.then?(await n)():n,e.s(["DELETE",()=>u,"GET",()=>i,"POST",()=>s,"PUT",()=>o]),t()}catch(e){t(e)}},!1),4337,e=>e.a(async(r,t)=>{try{var a=e.i(47909),n=e.i(74017),o=e.i(96250),s=e.i(59756),i=e.i(61916),u=e.i(14444),c=e.i(37092),l=e.i(69741),d=e.i(16795),m=e.i(87718),p=e.i(95169),E=e.i(47587),w=e.i(66012),h=e.i(70101),_=e.i(26937),R=e.i(10372),f=e.i(93695);e.i(52474);var b=e.i(220),v=e.i(21427),y=r([v]);[v]=y.then?(await y)():y;let O=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/aurora/groups/route",pathname:"/api/aurora/groups",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/aurora/groups/route.ts",nextConfigOutput:"",userland:v}),{workAsyncStorage:T,workUnitAsyncStorage:x,serverHooks:C}=O;function g(){return(0,o.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:x})}async function N(e,r,t){O.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/aurora/groups/route";a=a.replace(/\/index$/,"")||"/";let o=await O.prepare(e,r,{srcPage:a,multiZoneDraftMode:!1});if(!o)return r.statusCode=400,r.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve()),null;let{buildId:v,params:y,nextConfig:g,parsedUrl:N,isDraftMode:T,prerenderManifest:x,routerServerContext:C,isOnDemandRevalidate:I,revalidateOnlyGenerated:S,resolvedPathname:D,clientReferenceManifest:A,serverActionsManifest:j}=o,P=(0,l.normalizeAppPath)(a),q=!!(x.dynamicRoutes[P]||x.routes[D]),U=async()=>((null==C?void 0:C.render404)?await C.render404(e,r,N,!1):r.end("This page could not be found"),null);if(q&&!T){let e=!!x.routes[D],r=x.dynamicRoutes[P];if(r&&!1===r.fallback&&!e){if(g.experimental.adapterPath)return await U();throw new f.NoFallbackError}}let $=null;!q||O.isDev||T||($=D,$="/index"===$?"/":$);let H=!0===O.isDev||!q,M=q&&!H;j&&A&&(0,u.setReferenceManifestsSingleton)({page:a,clientReferenceManifest:A,serverActionsManifest:j,serverModuleMap:(0,c.createServerModuleMap)({serverActionsManifest:j})});let L=e.method||"GET",k=(0,i.getTracer)(),G=k.getActiveScopeSpan(),F={params:y,prerenderManifest:x,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:g.cacheLife,waitUntil:t.waitUntil,onClose:e=>{r.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(r,t,a)=>O.onRequestError(e,r,a,C)},sharedContext:{buildId:v}},B=new d.NodeNextRequest(e),W=new d.NodeNextResponse(r),J=m.NextRequestAdapter.fromNodeNextRequest(B,(0,m.signalFromNodeResponse)(r));try{let o=async e=>O.handle(J,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":r.statusCode,"next.rsc":!1});let t=k.getRootSpanAttributes();if(!t)return;if(t.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${t.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=t.get("next.route");if(n){let r=`${L} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":r}),e.updateName(r)}else e.updateName(`${L} ${a}`)}),u=!!(0,s.getRequestMeta)(e,"minimalMode"),c=async s=>{var i,c;let l=async({previousCacheEntry:n})=>{try{if(!u&&I&&S&&!n)return r.statusCode=404,r.setHeader("x-nextjs-cache","REVALIDATED"),r.end("This page could not be found"),null;let a=await o(s);e.fetchMetrics=F.renderOpts.fetchMetrics;let i=F.renderOpts.pendingWaitUntil;i&&t.waitUntil&&(t.waitUntil(i),i=void 0);let c=F.renderOpts.collectedTags;if(!q)return await (0,w.sendResponse)(B,W,a,F.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),r=(0,h.toNodeOutgoingHttpHeaders)(a.headers);c&&(r[R.NEXT_CACHE_TAGS_HEADER]=c),!r["content-type"]&&e.type&&(r["content-type"]=e.type);let t=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,n=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:r},cacheControl:{revalidate:t,expire:n}}}}catch(r){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,r,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:I})},C),r}},d=await O.handleResponse({req:e,nextConfig:g,cacheKey:$,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:x,isRoutePPREnabled:!1,isOnDemandRevalidate:I,revalidateOnlyGenerated:S,responseGenerator:l,waitUntil:t.waitUntil,isMinimalMode:u});if(!q)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});u||r.setHeader("x-nextjs-cache",I?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),T&&r.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return u&&q||m.delete(R.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||r.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,_.getCacheControlHeader)(d.cacheControl)),await (0,w.sendResponse)(B,W,new Response(d.value.body,{headers:m,status:d.value.status||200})),null};G?await c(G):await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${L} ${a}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},c))}catch(r){if(r instanceof f.NoFallbackError||await O.onRequestError(e,r,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:I})}),q)throw r;return await (0,w.sendResponse)(B,W,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>g,"routeModule",()=>O,"serverHooks",()=>C,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>x]),t()}catch(e){t(e)}},!1),14277,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__56e7cf5d._.js"].map(r=>e.l(r))).then(()=>r(63152)))},93306,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__045059a3._.js","server/chunks/[root-of-the-server]__a1bc4740._.js"].map(r=>e.l(r))).then(()=>r(38788)))},14115,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__c1120e1e._.js"].map(r=>e.l(r))).then(()=>r(26709)))},9193,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__b378aca5._.js"].map(r=>e.l(r))).then(()=>r(1346)))},85365,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__b0b24298._.js"].map(r=>e.l(r))).then(()=>r(33073)))},52170,e=>{e.v(r=>Promise.all(["server/chunks/[root-of-the-server]__c6f768da._.js"].map(r=>e.l(r))).then(()=>r(23492)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__6d43044a._.js.map