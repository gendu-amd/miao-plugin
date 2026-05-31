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
  // 已提供(见 models/gameDataPort.js);rank(群排行)待后续
  provides: ["gameData"],
  // 依赖:account(genshin 已提供)、renderer(框架统一出图,待实现)
  requires: ["account", "renderer"],
  // 后续埋的 hook 点(profile:beforeRender 供 ark 订阅),待实现后填充
  hooks: [],
  guoba: true,
}

try {
  const reg = globalThis.Bot?.core?.require?.("pluginRegistry")
  if (reg) {
    reg.register(manifest)
    logger?.mark?.("[contracts] miao 声明 manifest：provides=[gameData] requires=[account, renderer]")
  }
} catch (err) {
  logger?.warn?.(`[contracts] 注册 miao manifest 失败：${err?.message}`)
}

export default manifest
