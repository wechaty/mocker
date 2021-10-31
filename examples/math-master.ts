#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import * as WECHATY       from 'wechaty'
import { WechatyVorpal }  from 'wechaty-vorpal'
import { MathMaster }     from 'wechaty-vorpal-contrib'

import {
  createFixture,
  MessageMock,
}                   from '../src/mod.js' // from 'wechaty-mocker'

async function main (): Promise<number> {
  /**
   * The Math Master Game Vorpal Plugin:
   *  https://github.com/wechaty/wechaty-vorpal-contrib#4-mathmaster
   */
  const WechatyVorpalPlugin = WechatyVorpal({
    contact : true,
    use     : MathMaster(),
  })

  for await (const { wechaty, mocker } of createFixture()) {
    /**
     * Install Vorpal & Match Master Command
     */
    wechaty.wechaty.use(WechatyVorpalPlugin)

    /**
     * Player Logic
     */
    const onMessageMock = async (message: MessageMock) => {
      if (message.type() !== WECHATY.type.Message.Text)   { return }
      const text = message.text()
      if (!text)                                  { return }

      const MATH_RE = /Score: (\d+).+?(\d+) \+ (\d+) = \?/s
      const match = text.match(MATH_RE)
      if (!match)                                 { return }

      const score = parseInt(match[1]!, 10)
      if (score > 13)                             { return }

      const x = parseInt(match[2]!, 10)
      const y = parseInt(match[3]!, 10)

      const result = String(x + y)

      await new Promise(resolve => setTimeout(resolve, 500))
      mocker.player.say(result).to(mocker.bot)
    }
    mocker.player.on('message', onMessageMock)

    wechaty.wechaty.on('message', msg => console.info(
      msg.self() ? '<' : '>',
      msg.talker().name(),
      ':',
      msg.text(),
    ))

    mocker.player.say('math_master').to(mocker.bot)

    await new Promise<void>(resolve => wechaty.wechaty.on('message', msg => {
      if (/Game Over/i.test(msg.text())) {
        resolve()
      }
    }))

    mocker.player.say('Happy Testing!').to(mocker.bot)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return 0
}

main()
  .then(process.exit)
  .catch(console.error)
