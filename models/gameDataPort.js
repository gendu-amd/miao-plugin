/**
 * GameData 实现（chapter2 · P2）
 *
 * 把 miao 的角色/武器/圣遗物/画像模型包装成 L1 契约层的 `gameData` 能力,
 * 注册到 `Bot.core.provide('gameData', …)`。供 genshin/xiaoyao 等按接口取"图标/别名/元数据",
 * 不再 `file://` 直 import miao 内部文件。
 *
 * 非侵入:仅"新增" core 通道;miao 现有 `#miao.models` 调用全部保留。
 */
import { Character, Weapon, ArtifactSet, Player } from "#miao.models"

const gameDataPort = {
  meta: { provider: "miao", since: "P2" },

  /** 按名/别名/ID 取角色元数据(含别名解析);取不到→null。game: gs|sr */
  getCharacter: (name, game = "gs") => Character.get(name, game) || null,
  /** 取武器元数据;取不到→null */
  getWeapon: (name, game = "gs", type = "") => Weapon.get(name, game, type) || null,
  /** 取圣遗物套装元数据;取不到→null */
  getArtifactSet: (name, game = "gs") => ArtifactSet.get(name, game) || null,
  /** 由事件构造玩家画像对象(运行时数据,需 e) */
  getProfile: (e, game = "gs") => Player.create(e, game),

  /** 别名→标准名(取不到→原值);便于跨插件统一命名 */
  resolveName: (name, game = "gs") => {
    const c = Character.get(name, game)
    return c ? c.name : name
  },
}

try {
  if (globalThis.Bot?.core?.provide) {
    Bot.core.provide("gameData", gameDataPort)
    logger?.mark?.("[contracts] miao 提供能力：gameData")
  }
} catch (err) {
  logger?.warn?.(`[contracts] 注册 gameData 失败：${err?.message}`)
}

export default gameDataPort
