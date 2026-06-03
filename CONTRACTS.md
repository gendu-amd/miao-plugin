# miao 对外提供的能力（L1 契约层）

> 本仓作为"角色/面板/伤害 数据 SSOT",通过 Yunzai L1 契约层(`Bot.core`)对外暴露能力,供其它插件**按接口消费**,无需 `file://` import 本仓内部文件。
> 设计见主仓 `docs/target-architecture.md`。本文件随能力变更更新。

## 已提供

### `gameData`（GameDataProvider） — chapter2/P2（2026-05-31）
- 实现:`models/gameDataPort.js`(包 `#miao.models` 的 Character/Weapon/ArtifactSet/Player),注册于 `index.js`(副作用 import)。
- 获取:`const gd = Bot.core.require("gameData")`(取不到→null,调用方降级)。
- 方法:
  | 方法 | 说明 / 示例 |
  |---|---|
  | `getCharacter(name, game="gs")` | 角色元数据(含别名解析),取不到→null;如 `getCharacter("胡桃")→{name:胡桃,id:10000046,elem:pyro,star:5}` |
  | `getWeapon(name, game="gs", type="")` | 武器元数据,取不到→null |
  | `getArtifactSet(name, game="gs")` | 圣遗物套装元数据,取不到→null |
  | `getProfile(e, game="gs")` | 由事件构造玩家画像(运行时数据,需 e) |
  | `resolveName(name, game="gs")` | 别名→标准名,如 `resolveName("雷神")→"雷电将军"`;取不到→原值 |
- 性质:**非侵入新增**——仅在现有 `#miao.models` 之上包一层 `core` 通道;miao 内部调用全保留。消费方(genshin/xiaoyao)可逐步改用 `Bot.core.require("gameData")` 替代 `file://` 直 import。

### `rank`（群排行 RankProvider） — chapter2/P2（2026-05-31）
- 实现:`models/rankPort.js`(工厂式包 `models/ProfileRank.js`),注册于 `index.js`。
- 获取:`const rank = Bot.core.require("rank")`。
- 方法(均等价 ProfileRank 同名静态/工厂,数据一致):
  | 方法 | 说明 |
  |---|---|
  | `create({group,uid,qq})` | 构造群排行处理器,可 `.getRank(profile, force)` |
  | `getGroupMaxUidList(groupId,type,game)` | 群内某类型最高 uid 列表 |
  | `getGroupUidList(groupId,charId,type)` | 群内某角色 uid 列表 |
  | `getGroupCfg(groupId)` / `resetRank(...)` / `getUserUidMap(e,game)` | 群配置/重置/用户映射 |
- 范围:**群排行**;全服排名由 ark 等以 `rank.getGlobalRank?` 形式另行 provide(规划)。非侵入。

## 发布的 Hook 点

### `profile:beforeRender` — chapter2（2026-05-31）
- 位置:`apps/profile/ProfileDetail.js` 渲染真实点(`Common.render('character/profile-detail', renderData)` 之前)。
- 触发:`await Bot.core.hook.emitAsync('profile:beforeRender', { e, char, uid, game, mode, renderData })`(异步,等待所有订阅)。
- 订阅:`Bot.core.hook.on('profile:beforeRender', async p => { /* 就地改写 p.renderData，如注入 p.renderData.globalRank */ })`,返回值调用即退订(可逆)。
- 用途:供 ark 等**订阅注入**全服排名/评分等,**取代** `#ark替换文件` 覆盖 `ProfileDetail.js` + monkey-patch `render` 的侵入做法。无订阅者时 no-op、行为不变。

## 计划提供（后续）
- `rank`（群排行）能力;ark 迁到 `profile:beforeRender` 订阅后删除其覆盖文件(见主仓 ADR-004 退场清单)。
