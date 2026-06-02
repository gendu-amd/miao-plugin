/**
 * miao 插件清单（chapter1-05 · 声明式元信息）
 *
 * 向 L1 契约层 pluginRegistry 声明能力关系。纯声明、不触碰 loader。
 * requires 声明后,框架 checkRequires 即可体检:account 由 genshin 满足、
 * renderer 暂无人 provide → 真实供需闭环可见(缺失运行时由 require()→null 降级)。
 */
import { Version } from "#miao"

export const manifest = {
  name: "miao",
  version: Version?.version ?? "0.0.0",
  type: "data-provider",
  // ADR-007：{能力名: importer},框架 wireManifests 自动 core.provide(免手写样板)
  provides: {
    gameData: () => import("./models/gameDataPort.js"),
    rank: () => import("./models/rankPort.js"),
  },
  // 依赖:account(genshin 已提供)、renderer(框架已提供)
  requires: ["account", "renderer"],
  // 发布的 hook 点:面板渲染前(供 ark 等订阅注入排名,取代覆盖文件)
  hooks: ["profile:beforeRender"],
  guoba: true,
}

export default manifest
