import { Data, Version } from '#miao'
import Index from './tools/index.js'
// ADR-007 统一装配：gameData/rank 能力注册 + manifest 声明由框架 wireManifests() 据 manifest.js
// 自动完成,不再手写副作用 import(*Port.js 仅导出实现)。

if (!global.segment)
  global.segment = (await import('oicq')).segment

if (!segment.button)
  segment.button = () => ""

export * from './apps/index.js'

if (Bot?.logger?.info) {
  Bot.logger.info('---------^_^---------')
  Bot.logger.info(`喵喵插件${Version.version}初始化~`)
} else {
  console.log(`喵喵插件${Version.version}初始化~`)
}

setTimeout(Index.init, 1000)
