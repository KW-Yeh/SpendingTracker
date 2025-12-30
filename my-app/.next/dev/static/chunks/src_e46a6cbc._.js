(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/icons/ActionMenuIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionMenuIcon",
    ()=>ActionMenuIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const ActionMenuIcon = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        className: "bi bi-three-dots",
        viewBox: "0 0 16 16",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
        }, void 0, false, {
            fileName: "[project]/src/components/icons/ActionMenuIcon.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/icons/ActionMenuIcon.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ActionMenuIcon;
var _c;
__turbopack_context__.k.register(_c, "ActionMenuIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ActionMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionMenu",
    ()=>ActionMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ActionMenuIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/ActionMenuIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useFocusRef.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const ActionMenu = (props)=>{
    _s();
    const { options, onClick } = props;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "ActionMenu.useFocusRef[ref]": ()=>{
            setOpen(false);
        }
    }["ActionMenu.useFocusRef[ref]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>{
                    setOpen((prevState)=>!prevState);
                },
                className: `rounded-full p-2 transition-colors ${open ? 'bg-gray-300' : 'hover:bg-gray-300 active:bg-gray-300'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$ActionMenuIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionMenuIcon"], {
                    className: "size-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/ActionMenu.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ActionMenu.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `bg-background absolute top-full right-3 z-30 flex w-fit flex-col rounded-lg p-2 shadow transition-all ${open ? 'opacity-100' : 'hidden opacity-0'}`,
                children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            if (onClick) onClick(option.value);
                        },
                        className: `group flex items-center gap-2 rounded px-4 py-2 whitespace-nowrap transition-colors hover:bg-gray-100 active:bg-gray-100 ${option.className ?? ''}`,
                        children: option.label
                    }, option.value, false, {
                        fileName: "[project]/src/components/ActionMenu.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/ActionMenu.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ActionMenu.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ActionMenu, "AjTB9JzioCj/5mYcr1FZImZEFH0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = ActionMenu;
var _c;
__turbopack_context__.k.register(_c, "ActionMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/icons/DeleteIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeleteIcon",
    ()=>DeleteIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const DeleteIcon = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        className: "bi bi-trash",
        viewBox: "0 0 16 16",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/DeleteIcon.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/DeleteIcon.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/icons/DeleteIcon.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DeleteIcon;
var _c;
__turbopack_context__.k.register(_c, "DeleteIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/getCategoryIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCategoryIcon",
    ()=>getCategoryIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
;
;
function getCategoryIcon(category, className = '') {
    switch(category){
        case '🍔':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineFastfood"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 19,
                columnNumber: 14
            }, this);
        case '👗':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineCheckroom"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 21,
                columnNumber: 14
            }, this);
        case '🏠':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineHome"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 23,
                columnNumber: 14
            }, this);
        case '🚗':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineDirectionsCar"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 25,
                columnNumber: 14
            }, this);
        case '📚':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineSchool"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 27,
                columnNumber: 14
            }, this);
        case '🎲':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineCatchingPokemon"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 29,
                columnNumber: 14
            }, this);
        case '🧻':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineChecklistRtl"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 31,
                columnNumber: 14
            }, this);
        case '💊':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineHealing"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 33,
                columnNumber: 14
            }, this);
        case '📉':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineBalance"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 35,
                columnNumber: 14
            }, this);
        case '📈':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineBalance"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 37,
                columnNumber: 14
            }, this);
        case '💰':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineMonetizationOn"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 39,
                columnNumber: 14
            }, this);
        case '🎁':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineRedeem"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 41,
                columnNumber: 14
            }, this);
        case '✨':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdOutlineCategory"], {
                className: className
            }, void 0, false, {
                fileName: "[project]/src/utils/getCategoryIcon.tsx",
                lineNumber: 43,
                columnNumber: 14
            }, this);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/getSpendingCategoryMap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSpendingCategoryMap",
    ()=>getSpendingCategoryMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/constants.ts [app-client] (ecmascript)");
;
const getSpendingCategoryMap = (type)=>{
    return type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendingType"].Income ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INCOME_TYPE_MAP"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTCOME_TYPE_MAP"];
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/normalizeNumber.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeNumber",
    ()=>normalizeNumber
]);
"use client";
const normalizeNumber = (num)=>{
    const res = [];
    const digitList = num.toString().split("").reverse();
    let count = 0;
    digitList.forEach((digit)=>{
        if (count !== 0 && count % 3 === 0 && isNumber(digit)) {
            res.push(",");
        }
        res.push(digit);
        count++;
    });
    return res.toReversed().join("");
};
function isNumber(val) {
    return /^\d+$/.test(val);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/transactions/SpendingItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpendingItem",
    ()=>SpendingItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ActionMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ActionMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$DeleteIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/DeleteIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$EditIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/EditIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$getRecords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/getRecords.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getCategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getCategoryIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getSpendingCategoryMap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getSpendingCategoryMap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$normalizeNumber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/normalizeNumber.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const SpendingItem = (props)=>{
    _s();
    const { spending, refreshData } = props;
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SpendingItem.useMemo[categories]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getSpendingCategoryMap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSpendingCategoryMap"])(spending.type)
    }["SpendingItem.useMemo[categories]"], [
        spending.type
    ]);
    const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SpendingItem.useMemo[category]": ()=>categories.find({
                "SpendingItem.useMemo[category]": (cat)=>cat.value === spending.category
            }["SpendingItem.useMemo[category]"])
    }["SpendingItem.useMemo[category]"], [
        categories,
        spending.category
    ]);
    const additionalStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SpendingItem.useMemo[additionalStyle]": ()=>{
            if (deleting) {
                return 'shadow-[0_0_0_2px_#fca5a5]';
            }
            return 'active:bg-gray-100 hover:bg-gray-100';
        }
    }["SpendingItem.useMemo[additionalStyle]"], [
        deleting
    ]);
    const handleOnDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpendingItem.useCallback[handleOnDelete]": ()=>{
            if (!confirm('確定要刪除這筆資料嗎?')) return;
            setDeleting(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$getRecords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteItem"])(spending.id).then({
                "SpendingItem.useCallback[handleOnDelete]": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"])({
                        "SpendingItem.useCallback[handleOnDelete]": ()=>{
                            setDeleting(false);
                            refreshData();
                        }
                    }["SpendingItem.useCallback[handleOnDelete]"]);
                }
            }["SpendingItem.useCallback[handleOnDelete]"]);
        }
    }["SpendingItem.useCallback[handleOnDelete]"], [
        refreshData,
        spending.id
    ]);
    const handleAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpendingItem.useCallback[handleAction]": (action)=>{
            if (action === 'delete') {
                handleOnDelete();
            } else if (action === 'edit') {
                router.push(`/edit?id=${spending.id}`);
            }
        }
    }["SpendingItem.useCallback[handleAction]"], [
        handleOnDelete,
        router,
        spending.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm transition-all sm:text-base md:p-3 ${additionalStyle}`,
        children: [
            deleting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute top-0 left-1 -translate-y-1/2 rounded-full bg-red-300 px-2 py-0.5 text-xs font-bold text-white",
                children: "刪除中"
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_WORDING_MAP"][category.value],
                className: "flex size-6 items-center justify-center rounded-md",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getCategoryIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCategoryIcon"])(category.value, `size-5 ${spending.necessity === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Necessity"].Need ? 'text-primary-500' : 'text-gray-500'}`)
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                title: spending.description,
                className: "flex-1 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5 font-medium",
                children: spending.description
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-fit text-end font-bold ${spending.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendingType"].Outcome ? 'text-red-500' : 'text-green-500'}`,
                children: [
                    "$",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$normalizeNumber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeNumber"])(Number(spending.amount))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ActionMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionMenu"], {
                onClick: handleAction,
                options: [
                    {
                        value: 'edit',
                        label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/edit?id=${spending.id}`,
                            className: "text-text group-hover:text-primary-500 group-active:text-primary-500 flex items-center gap-3 rounded px-2 py-1 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$EditIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditIcon"], {
                                    className: "size-3.5 transition-colors sm:size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                                    lineNumber: 109,
                                    columnNumber: 17
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "編輯"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                                    lineNumber: 110,
                                    columnNumber: 17
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                            lineNumber: 105,
                            columnNumber: 15
                        }, void 0)
                    },
                    {
                        value: 'delete',
                        label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "group text-text flex items-center gap-3 rounded px-2 py-1 transition-colors group-hover:text-red-500 group-active:text-red-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$DeleteIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteIcon"], {
                                    className: "size-3.5 transition-colors sm:size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                                    lineNumber: 118,
                                    columnNumber: 17
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "刪除"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                                    lineNumber: 119,
                                    columnNumber: 17
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                            lineNumber: 117,
                            columnNumber: 15
                        }, void 0)
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingItem.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/transactions/SpendingItem.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SpendingItem, "b34a9SEz/T5mvyBe4ahm7qQpcX4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SpendingItem;
var _c;
__turbopack_context__.k.register(_c, "SpendingItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/icons/SearchIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchIcon",
    ()=>SearchIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const SearchIcon = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        viewBox: "0 0 16 16",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
        }, void 0, false, {
            fileName: "[project]/src/components/icons/SearchIcon.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/icons/SearchIcon.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SearchIcon;
var _c;
__turbopack_context__.k.register(_c, "SearchIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/formatDate.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate
]);
const formatDate = (date, formation = 'MM/dd')=>{
    const _date = new Date(date);
    const year = _date.getFullYear();
    const month = (_date.getMonth() + 1).toString().padStart(2, '0');
    const day = _date.getDate().toString().padStart(2, '0');
    if (formation === 'MM/dd') {
        return `${month}/${day}`;
    } else if (formation === 'yyyy/MM/dd/') {
        return `${year}/${month}/${day}`;
    }
    return _date.toLocaleDateString();
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/transactions/SpendingList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpendingList",
    ()=>SpendingList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$transactions$2f$SpendingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/transactions/SpendingItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$SearchIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/SearchIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatDate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/formatDate.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const SpendingList = (props)=>{
    _s();
    const { refreshData, data, filterStr, loading } = props;
    const filteredBySearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SpendingList.useMemo[filteredBySearch]": ()=>data.filter({
                "SpendingList.useMemo[filteredBySearch]": (d)=>filterStr === '' || d.description.includes(filterStr)
            }["SpendingList.useMemo[filteredBySearch]"])
    }["SpendingList.useMemo[filteredBySearch]"], [
        data,
        filterStr
    ]);
    const sortedByDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SpendingList.useMemo[sortedByDay]": ()=>{
            const result = {};
            filteredBySearch.forEach({
                "SpendingList.useMemo[sortedByDay]": (d)=>{
                    const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$formatDate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d.date);
                    if (!result[date]) result[date] = [];
                    result[date].push(d);
                }
            }["SpendingList.useMemo[sortedByDay]"]);
            return result;
        }
    }["SpendingList.useMemo[sortedByDay]"], [
        filteredBySearch
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full flex-col gap-2 text-xs sm:text-sm",
            children: [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-1 h-4 w-24 animate-pulse rounded-md bg-gray-200"
                        }, void 0, false, {
                            fileName: "[project]/src/app/transactions/SpendingList.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"
                        }, void 0, false, {
                            fileName: "[project]/src/app/transactions/SpendingList.tsx",
                            lineNumber: 40,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1 h-12 w-full animate-pulse rounded-lg bg-gray-100 sm:h-14"
                        }, void 0, false, {
                            fileName: "[project]/src/app/transactions/SpendingList.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, i, true, {
                    fileName: "[project]/src/app/transactions/SpendingList.tsx",
                    lineNumber: 38,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/src/app/transactions/SpendingList.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    } else if (filteredBySearch.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-8 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$SearchIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchIcon"], {
                    className: "mb-3 size-10 text-gray-300"
                }, void 0, false, {
                    fileName: "[project]/src/app/transactions/SpendingList.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-1 font-medium text-gray-600",
                    children: "找不到符合的帳目"
                }, void 0, false, {
                    fileName: "[project]/src/app/transactions/SpendingList.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-400",
                    children: "請嘗試其他搜尋條件或新增帳目"
                }, void 0, false, {
                    fileName: "[project]/src/app/transactions/SpendingList.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/transactions/SpendingList.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex w-full flex-col gap-2 text-xs sm:text-sm",
        children: Object.keys(sortedByDay).map((dateStr, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-500",
                        children: dateStr
                    }, void 0, false, {
                        fileName: "[project]/src/app/transactions/SpendingList.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1 rounded border-2 border-solid border-transparent p-1 transition-all",
                        id: `spending-list-${dateStr}`,
                        children: sortedByDay[dateStr].map((spending, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$transactions$2f$SpendingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendingItem"], {
                                spending: spending,
                                refreshData: refreshData
                            }, `${spending.id}-${index.toString()}`, false, {
                                fileName: "[project]/src/app/transactions/SpendingList.tsx",
                                lineNumber: 66,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/app/transactions/SpendingList.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, dateStr, true, {
                fileName: "[project]/src/app/transactions/SpendingList.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/app/transactions/SpendingList.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SpendingList, "SJc+DD4iprhiAKygnGsd8WIOZao=");
_c = SpendingList;
var _c;
__turbopack_context__.k.register(_c, "SpendingList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/icons/CalendarIcon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalendarIcon",
    ()=>CalendarIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const CalendarIcon = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        fill: "currentColor",
        className: "bi bi-calendar-event",
        viewBox: "0 0 16 16",
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/CalendarIcon.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons/CalendarIcon.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/icons/CalendarIcon.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CalendarIcon;
var _c;
__turbopack_context__.k.register(_c, "CalendarIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/analysis/YearMonthFilter.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "dropIn": "YearMonthFilter-module__HsT8ZG__dropIn",
  "dropdownAnimation": "YearMonthFilter-module__HsT8ZG__dropdownAnimation",
  "monthButton": "YearMonthFilter-module__HsT8ZG__monthButton",
  "navButton": "YearMonthFilter-module__HsT8ZG__navButton",
});
}),
"[project]/src/app/analysis/YearMonthFilter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "YearMonthFilter",
    ()=>YearMonthFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$CalendarIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/CalendarIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useFocusRef.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/bi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/analysis/YearMonthFilter.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const YearMonthFilter = (props)=>{
    _s();
    const { refreshData, group, dateOptions, className = '' } = props;
    const { setYear, year, setMonth, month } = dateOptions;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "YearMonthFilter.useFocusRef[ref]": ()=>{
            setOpen(false);
        }
    }["YearMonthFilter.useFocusRef[ref]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "YearMonthFilter.useEffect": ()=>{
            refreshData(group?.account_id ? String(group.account_id) : undefined, year, month);
        }
    }["YearMonthFilter.useEffect"], [
        group?.account_id,
        year,
        month,
        refreshData
    ]);
    const handlePreviousMonth = ()=>{
        if (month === '1') {
            setMonth('12');
            setYear((Number(year) - 1).toString());
        } else {
            setMonth((Number(month) - 1).toString());
        }
        setOpen(false);
    };
    const handleNextMonth = ()=>{
        if (month === '12') {
            setMonth('1');
            setYear((Number(year) + 1).toString());
        } else {
            setMonth((Number(month) + 1).toString());
        }
        setOpen(false);
    };
    const currentMonthName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_MAP"][month];
    const isCurrentMonth = ()=>{
        const today = new Date();
        return today.getFullYear().toString() === year && (today.getMonth() + 1).toString() === month;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className} transition-all ${open ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md' : 'hover:border-primary-300 hover:bg-primary-50 border-gray-300 bg-white text-gray-800'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handlePreviousMonth,
                        className: `flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-all hover:bg-gray-100 active:bg-gray-200 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].navButton}`,
                        "aria-label": "上個月",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiChevronLeft"], {
                            className: "size-6"
                        }, void 0, false, {
                            fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setOpen(true),
                        className: `flex items-center gap-3 rounded-lg px-4 py-2`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$CalendarIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalendarIcon"], {
                                className: "text-primary-500 size-5"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-medium",
                                        children: currentMonthName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-500",
                                        children: year
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            isCurrentMonth() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-primary-100 text-primary-700 ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
                                children: "本月"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleNextMonth,
                        className: `flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-all hover:bg-gray-100 active:bg-gray-200 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].navButton}`,
                        "aria-label": "下個月",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiChevronRight"], {
                            className: "size-6"
                        }, void 0, false, {
                            fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ref,
                className: `absolute top-full left-1/2 z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg ${open ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dropdownAnimation} visible opacity-100` : 'invisible opacity-0'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-primary-50 mb-4 flex items-center justify-between rounded-md p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setYear((Number(year) - 1).toString()),
                                className: "flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-all hover:bg-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiChevronLeft"], {
                                    className: "size-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-primary-700 text-lg font-bold",
                                children: year
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setYear((Number(year) + 1).toString()),
                                className: "flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-all hover:bg-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiChevronRight"], {
                                    className: "size-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-2",
                        children: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_LABEL"]).map((monthLabel)=>{
                            const isSelected = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_LABEL"][monthLabel] === month;
                            const isCurrentYearMonth = new Date().getFullYear().toString() === year && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_LABEL"][monthLabel] === (new Date().getMonth() + 1).toString();
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setMonth(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_LABEL"][monthLabel]);
                                    setOpen(false);
                                },
                                className: `relative rounded-md px-2 py-2 text-center font-medium transition-all ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].monthButton} ${isSelected ? 'bg-primary-500 text-white' : 'hover:bg-primary-100 hover:text-primary-700 text-gray-700'}`,
                                children: [
                                    monthLabel,
                                    isCurrentYearMonth && !isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                        lineNumber: 169,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, monthLabel, true, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex justify-between border-t border-gray-100 pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    // Go to previous year, same month
                                    setYear((Number(year) - 1).toString());
                                },
                                className: "hover:text-primary-700 text-sm font-medium text-gray-600",
                                children: "去年同月"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const today = new Date();
                                    setMonth((today.getMonth() + 1).toString());
                                    setYear(today.getFullYear().toString());
                                    setOpen(false);
                                },
                                className: "bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-md px-3 py-1 text-sm font-medium",
                                children: "回到本月"
                            }, void 0, false, {
                                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/analysis/YearMonthFilter.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(YearMonthFilter, "9HpbBgSBVpVpKRKjMUkXlQH4OFE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useFocusRef$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = YearMonthFilter;
var _c;
__turbopack_context__.k.register(_c, "YearMonthFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useScrollToTop.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollToTop",
    ()=>useScrollToTop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const useScrollToTop = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollToTop.useEffect": ()=>{
            window.scrollTo(0, 0);
        }
    }["useScrollToTop.useEffect"], []);
};
_s(useScrollToTop, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useYearMonth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useYearMonth",
    ()=>useYearMonth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const useYearMonth = (today)=>{
    _s();
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(`${today.getFullYear()}`);
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(`${today.getMonth() + 1}`);
    return {
        today: new Date(Number(year), Number(month) - 1),
        year,
        setYear,
        month,
        setMonth
    };
};
_s(useYearMonth, "nplTKMlHQ+1lMISnB0RyYIb2st4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/transactions/SpendingInfoSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpendingInfoSection",
    ()=>SpendingInfoSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$transactions$2f$SpendingList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/transactions/SpendingList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/analysis/YearMonthFilter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$SearchIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons/SearchIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$GroupProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/GroupProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SpendingProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SpendingProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$UserConfigProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/UserConfigProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollToTop$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollToTop.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useYearMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useYearMonth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getStartEndOfMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/getStartEndOfMonth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
const SpendingInfoSection = ({ isMobile })=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollToTop$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollToTop"])();
    const { config: userData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$UserConfigProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserConfigCtx"])();
    const { syncData, data, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SpendingProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetSpendingCtx"])();
    const { currentGroup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$GroupProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroupCtx"])();
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [monthlyData, setMonthlyData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterStr, setFilterStr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const searchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dateHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useYearMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useYearMonth"])(new Date());
    const refreshData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpendingInfoSection.useCallback[refreshData]": (_groupId)=>{
            const { startDate, endDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getStartEndOfMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStartEndOfMonth"])(new Date(Number(dateHook.year), Number(dateHook.month) - 1));
            syncData(_groupId || undefined, userData?.email, startDate.toISOString(), endDate.toISOString());
        }
    }["SpendingInfoSection.useCallback[refreshData]"], [
        syncData,
        userData?.email,
        dateHook.year,
        dateHook.month
    ]);
    const getNewData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SpendingInfoSection.useCallback[getNewData]": (_groupId, year, month)=>{
            const { startDate, endDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getStartEndOfMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStartEndOfMonth"])(new Date(Number(year), Number(month) - 1));
            syncData(_groupId || undefined, userData?.email, startDate.toISOString(), endDate.toISOString());
        }
    }["SpendingInfoSection.useCallback[getNewData]"], [
        syncData,
        userData?.email
    ]);
    const handleSelectDataPoint = (state)=>{
        if (!state.activePayload || !state.activePayload[0]) return;
        const selectedLabel = state.activePayload[0].payload.date;
        if (!selectedLabel) return;
        const element = document.getElementById(`spending-list-${selectedLabel}`);
        if (!element) return;
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        element.style.borderColor = '#fff085';
        setTimeout(()=>{
            element.style.borderColor = 'transparent';
        }, 2000);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpendingInfoSection.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"])({
                "SpendingInfoSection.useEffect": ()=>{
                    if (loading || !userData?.email) return;
                    const dataFilterByUser = [
                        ...data
                    ].filter({
                        "SpendingInfoSection.useEffect.dataFilterByUser": (_data)=>checkUser(_data, userData.email)
                    }["SpendingInfoSection.useEffect.dataFilterByUser"]);
                    setMonthlyData(dataFilterByUser);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"])({
                        "SpendingInfoSection.useEffect": ()=>{
                            setIsProcessing(false);
                        }
                    }["SpendingInfoSection.useEffect"]);
                }
            }["SpendingInfoSection.useEffect"]);
        }
    }["SpendingInfoSection.useEffect"], [
        data,
        userData?.email,
        loading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpendingInfoSection.useEffect": ()=>{
            const elem = searchRef.current;
            const handleOnChangeSearch = {
                "SpendingInfoSection.useEffect.handleOnChangeSearch": ()=>{
                    setFilterStr(elem?.value || '');
                }
            }["SpendingInfoSection.useEffect.handleOnChangeSearch"];
            elem?.addEventListener('change', handleOnChangeSearch);
            return ({
                "SpendingInfoSection.useEffect": ()=>elem?.removeEventListener('change', handleOnChangeSearch)
            })["SpendingInfoSection.useEffect"];
        }
    }["SpendingInfoSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpendingInfoSection.useEffect": ()=>{
            const { startDate, endDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$getStartEndOfMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStartEndOfMonth"])(new Date(Number(dateHook.year), Number(dateHook.month) - 1));
            syncData(currentGroup?.account_id ? String(currentGroup.account_id) : undefined, userData?.email, startDate.toISOString(), endDate.toISOString());
        }
    }["SpendingInfoSection.useEffect"], [
        currentGroup?.account_id,
        dateHook.month,
        dateHook.year,
        syncData,
        userData?.email
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "content-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analysis$2f$YearMonthFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YearMonthFilter"], {
                refreshData: getNewData,
                group: currentGroup,
                dateOptions: dateHook,
                className: "flex self-center rounded-lg border border-gray-200 bg-white p-2 text-base shadow-sm"
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full flex-col items-center gap-5 md:flex-row md:items-start",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-200 p-5 shadow-sm transition-shadow duration-200 hover:shadow",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-5 flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold",
                                    children: "帳目"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "group hover:border-primary-400 focus-within:border-primary-500 relative ml-auto flex items-center gap-2 rounded-lg border border-solid border-gray-300 px-3 py-1.5 transition-all focus-within:shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2f$SearchIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchIcon"], {
                                            className: "group-hover:text-primary-500 group-focus-within:text-primary-500 text-gray-500 transition-colors"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                                            lineNumber: 145,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            ref: searchRef,
                                            type: "text",
                                            placeholder: "搜尋帳目...",
                                            className: "w-32 bg-transparent py-0.5 text-sm font-medium focus:outline-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$transactions$2f$SpendingList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpendingList"], {
                            data: monthlyData,
                            filterStr: filterStr,
                            loading: isProcessing,
                            refreshData: refreshData
                        }, void 0, false, {
                            fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/transactions/SpendingInfoSection.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SpendingInfoSection, "eMjyxYi/p+MnmM3rwaLkU4UWfPw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollToTop$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollToTop"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$UserConfigProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserConfigCtx"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SpendingProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetSpendingCtx"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$GroupProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroupCtx"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useYearMonth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useYearMonth"]
    ];
});
_c = SpendingInfoSection;
function checkUser(_data, email) {
    return email === '' || _data['user-token'] === email;
}
var _c;
__turbopack_context__.k.register(_c, "SpendingInfoSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePrefetchRoute.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrefetchRoute",
    ()=>usePrefetchRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const usePrefetchRoute = (route)=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePrefetchRoute.useEffect": ()=>{
            router.prefetch(route);
        }
    }["usePrefetchRoute.useEffect"], [
        router,
        route
    ]);
};
_s(usePrefetchRoute, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PrefetchRoute.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrefetchRoute",
    ()=>PrefetchRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePrefetchRoute.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const PrefetchRoute = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"])('/edit');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"])('/analysis');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"])('/group');
    return null;
};
_s(PrefetchRoute, "YaiTRvGNqO+sKRhqrUtMvycWYOA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePrefetchRoute$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefetchRoute"]
    ];
});
_c = PrefetchRoute;
var _c;
__turbopack_context__.k.register(_c, "PrefetchRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_e46a6cbc._.js.map