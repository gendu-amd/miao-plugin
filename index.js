import { Data, Version } from '#miao'
import Index from './tools/index.js'
// 向 L1 契约层注册能力(副作用 import,provider 自注册):gameData/rank。
import './models/gameDataPort.js'
import './models/rankPort.js'

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
