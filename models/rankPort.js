/**
 * RankPort 实现（chapter2 · P2）
 *
 * 把 miao 的群排行(ProfileRank)能力包装成 L1 契约层的 `rank` 能力，
 * 注册到 `Bot.core.provide('rank', …)`。供其它插件按接口消费群排行，
 * 不再 `file://` 直 import miao 内部文件。
 *
 * 工厂式：返回/转发 miao 现有 ProfileRank 的实例与静态方法（同一类、行为等价）。
 * 非侵入：仅"新增" core 通道；miao 内部用法全保留。
 * 注：全服排名(ark)是另一 provider 的 rank.getGlobalRank?，本能力只提供群排行。
 */
import ProfileRank from "./ProfileRank.js"

const rankPort = {
  meta: { provider: "miao", since: "P2", scope: "group" },

  /** 构造群排行处理器（等价 ProfileRank.create(data)）。data: { group, uid, qq } */
  create: data => ProfileRank.create(data),

  /** 群内某类型的最高 uid 列表（等价 ProfileRank.getGroupMaxUidList） */
  getGroupMaxUidList: (groupId, type = "mark", game = "gs") =>
    ProfileRank.getGroupMaxUidList(groupId, type, game),

  /** 群内某角色的 uid 列表（等价 ProfileRank.getGroupUidList） */
  getGroupUidList: (groupId, charId, type = "mark") =>
    ProfileRank.getGroupUidList(groupId, charId, type),

  /** 群排行配置（等价 ProfileRank.getGroupCfg） */
  getGroupCfg: groupId => ProfileRank.getGroupCfg(groupId),

  /** 重置群排行（等价 ProfileRank.resetRank） */
  resetRank: (groupId, charId = "", game = "gs") =>
    ProfileRank.resetRank(groupId, charId, game),

  /** 用户 uid 映射（等价 ProfileRank.getUserUidMap） */
  getUserUidMap: (e, game = "gs") => ProfileRank.getUserUidMap(e, game),
}

try {
  globalThis.Bot?.core?.provide?.("rank", rankPort)
} catch (err) {
  logger?.warn?.(`[contracts] 注册 rank 失败:${err?.message}`)
}

export default rankPort
