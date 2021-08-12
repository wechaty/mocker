#!/usr/bin/env ts-node

import { test }  from 'tstest'

import { Message } from 'wechaty'

import { createFixture } from '../src/mod'

test('integration testing', async t => {
  for await (const fixture of createFixture()) {
    const bot = fixture.wechaty.wechaty.userSelf()

    const directMessage = await new Promise<Message>(resolve => {
      bot.once('message', resolve)
      fixture.mocker.player.say().to(fixture.mocker.bot)
    })
    fixture.mocker.player.say('test').to(fixture.mocker.bot)

    t.ok(directMessage, 'should resolve a message')
  }
})
