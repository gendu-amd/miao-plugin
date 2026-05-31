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

## 插件清单（manifest） — chapter1-05
- 实现:`manifest.js`(自注册到 `pluginRegistry`)。
- 声明:`provides=[gameData]`、`requires=[account, renderer]`、`type=data-provider`、`guoba=true`。
- 依赖体检(`pluginRegistry.checkRequires`):`account` 由 genshin 满足;`renderer` 待框架实现 → 当前 `checkRequires` 报 `{miao:[renderer]}`(缺失运行时由 `require()→null` 降级)。

## 计划提供（后续）
- `rank`（群排行）+ 埋 hook 点 `profile:beforeRender`(供 ark 非侵入订阅,替代 `#ark替换文件`),见主仓 `docs/refactor-progress.md`。
