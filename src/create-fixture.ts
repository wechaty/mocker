/* eslint-disable sort-keys */
import {
  PuppetMock,
  mock,
}                 from 'wechaty-puppet-mock'
import {
  Wechaty,
  WechatyBuilder,
  Message,
  Room,
  Contact,
}                 from 'wechaty'
import type {
  ContactSelf,
}                 from 'wechaty'

import type { EnvironmentMock } from './mock.js'

interface Fixture {
  mocker: {
    mocker : mock.Mocker,

    room   : mock.RoomMock,
    bot    : mock.ContactMock,
    player : mock.ContactMock,
  },

  wechaty : {
    wechaty : Wechaty,

    room    : Room,
    bot     : ContactSelf,
    player  : Contact,

    /**
     * A message should be that:
     *  1. said by player
     *  1. in room
     *  1. with type `text`, random content
     */
    message : Message,
  },

  moList: Message[],
  mtList: Message[],
}

async function * createFixture (
  environment?: EnvironmentMock,
): AsyncGenerator<Fixture> {
  const mocker = new mock.Mocker()
  if (environment) {
    mocker.use(environment)
  }

  const puppet = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

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
    mocker: {
      mocker,

      bot,
      player,
      room,
    },

    wechaty: {
      wechaty,

      bot    : wechaty.currentUser,
      player : (await wechaty.Contact.find({ id: player.id }))!,
      room   : (await wechaty.Room.find({ id: room.id }))!,

      message,
    },

    moList,
    mtList,
  }

  /**
   * Huan(202108): clean up event loops tasks
   *  before stop wechaty
   */
  await new Promise(setImmediate)

  await wechaty.stop()
}

export { createFixture }
