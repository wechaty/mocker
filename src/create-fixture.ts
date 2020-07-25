/* eslint-disable sort-keys */
import {
  PuppetMock,
}                 from 'wechaty-puppet-mock'
import {
  Wechaty,
  Message,
}                  from 'wechaty'

import { Mocker } from './mocker'
import {
  ContactMock,
  RoomMock,
}                 from './user/mod'
interface Fixture {
  wechaty : Wechaty,
  mocker  : Mocker,

  moList: Message[],
  mtList: Message[],

  bot     : ContactMock,
  player  : ContactMock,
  message : Message,

  room: RoomMock,
}

async function * createFixture (): AsyncGenerator<Fixture> {
  const mocker = new Mocker()
  // FIXME(huan): any
  const puppet = new PuppetMock({ mocker: mocker as any })
  const wechaty = new Wechaty({ puppet })

  await wechaty.start()

  const bot    = mocker.createContact({ name: 'Bot' })
  const player = mocker.createContact({ name: 'Player' })
  mocker.login(bot)

  const room = mocker.createRoom({
    memberIdList: [
      bot.id,
      player.id,
    ],
  })

  const messageFuture = new Promise<Message>(resolve => wechaty.once('message', resolve))
  player.say().to(bot)
  const message = await messageFuture

  // Mobile Terminated
  const mtList = [] as Message[]
  const recordMobileTerminatedMessage = (message: Message) => {
    if (!message.self()) {
      mtList.push(message)
    }
  }
  wechaty.on('message', recordMobileTerminatedMessage)

  // Mobile Originated
  const moList = [] as Message[]
  const recordMobileOriginatedMessage = (message: Message) => {
    if (message.self()) {
      moList.push(message)
    }
  }
  wechaty.on('message', recordMobileOriginatedMessage)

  yield {
    wechaty,
    mocker,

    bot,
    player,
    message,
    room,

    moList,
    mtList,
  }

  await wechaty.stop()
}

export { createFixture }
