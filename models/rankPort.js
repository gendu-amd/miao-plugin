/**
 * `rank` 能力实现 —— 转发 miao 的群排行(ProfileRank)实例与静态方法(同一类、行为等价),供其它插件
 * 按接口消费群排行,不再 `file://` 直 import miao 内部文件。注:全服排名(ark)不在此能力范围内。
 */
import ProfileRank from "./ProfileRank.js"

const rankPort = {
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
