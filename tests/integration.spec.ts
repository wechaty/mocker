#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

import type { Message } from 'wechaty'

import { createFixture } from '../src/mod.js'

test('integration testing', async t => {
  for await (const fixture of createFixture()) {
    const bot = fixture.wechaty.wechaty.currentUser

    const directMessage = await new Promise<Message>(resolve => {
      bot.once('message', resolve)
      fixture.mocker.player.say().to(fixture.mocker.bot)
    })
    fixture.mocker.player.say('test').to(fixture.mocker.bot)

    t.ok(directMessage, 'should resolve a message')
  }
})
