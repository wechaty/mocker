/* eslint-disable sort-keys */
import {
  PuppetMock,
  mock,
}                 from 'wechaty-puppet-mock'
import {
  Wechaty,
  Message,
  Room,
  Contact,
}                 from 'wechaty'
import {
  ContactSelf,
}                 from 'wechaty/dist/src/user/mod'

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

async function * createFixture (): AsyncGenerator<Fixture> {
  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })
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
    mocker: {
      mocker,

      bot,
      player,
      room,
    },

    wechaty: {
      wechaty,

      bot    : wechaty.userSelf(),
      player : wechaty.Contact.load(player.id),
      room   : wechaty.Room.load(room.id),

      message,
    },

    moList,
    mtList,
  }

  await wechaty.stop()
}

export { createFixture }
