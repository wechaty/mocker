# wechaty-mocker

[![NPM Version](https://img.shields.io/npm/v/wechaty-mocker?color=brightgreen)](https://www.npmjs.com/package/wechaty-mocker)
![NPM](https://github.com/wechaty/wechaty-mocker/workflows/NPM/badge.svg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/Wechaty/wechaty)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

![Wechaty Mocker](docs/images/the-matrix.jpg)

> Image: [The Matrix](https://100scifimovies.com/the-matrix/)

Wechaty Mocker provides the mocking system for testing Wechaty Chatbots.

## What is this

This is an essential component when you are trying to test your wechaty puppet implementation. This project is aim to provide a tool that helps you mock a wechat account, which could mock an account with mock contacts and mock rooms, and generate messages (in different types), events (like friendship events, room events etc) for you.

## Why do we need this

Currently there are several wechaty puppets available, like `wechaty-puppet-macpro` or `wechaty-puppet-padplus`, but we don't know how many instance we could run on a 2 core cpu 4G memory machine, when it came to industry usage of these project, the performance is a key attribute. The reason that we don't know the answer to the question is that we can not evaluate this, there is no test server that we can use since we are trying to connect to Wechat. Thus we need a mock tool to mock these things so we can do some pressure testing on our puppet code, then we will have confidence to say how many wechat accounts could be run on a 2 core cpu 4G memory machine. From that point, we will be able to find a number to optimize.

## Features

* Generate wechat account, includes `wxid`, `name`, `weixin`, `avatar`, `gender`
* Generate contacts and rooms: according to config (contact count, room count, room member distribution)
* Emit messages: according to config (frequency, message types, room message ratio and contact message ratio)
* Emit friendship events: according to config (frequency) emit friendship events
* Emit room events; according to config (frequency of different room events)

## Usage

```ts
import { createFixture } from 'wechaty-mocker'

for await (const { wechaty, mocker } of createFixture()) {
  // 1. Log Wechaty messages
  wechaty.wechaty.on('message', console.info)
  // 2. Make player say something to our bot
  mocker.player.say().to(mocker.bot)
  // 3. Wait and see. That's it!
  await new Promise(setImmediate)
}
```

## Example

Here's a example for testing [Vorpal Game: Math Master](https://github.com/wechaty/wechaty-vorpal-contrib#4-mathmaster) by Wechaty Mocker.

Math Master is a text game that the bot will ask player to calculate numbers, and the player will get 1 score for each right answer. The game will increase the difficulty by asking bigger numbers, and each round the player must text the right answer in no more than 10 seconds.

In this example, we will use our mocking system to pretend we are a player, to play the game to get a very high score (like 13)!

```ts
/**
 * Player Logic
 */
const onMessageMock = async (message: mock.MessageMock) => {
  if (message.type() !== Message.Type.Text)   { return }
  const text = message.text()
  if (!text)                                  { return }

  const MATH_RE = /Score: (\d+).+?(\d+) \+ (\d+) = \?/s
  const match = text?.match(MATH_RE)
  if (!match)                                 { return }

  const score = parseInt(match[1], 10)
  if (score > 13)                             { return }

  const x = parseInt(match[2], 10)
  const y = parseInt(match[3], 10)

  const result = String(x + y)

  await new Promise(resolve => setTimeout(resolve, 500))
  mocker.player.say(result).to(mocker.bot)
}

mocker.player.on('message', onMessageMock)
```

The full source code can be found at: [examples/math-master.ts](examples/math-master.ts)

## Reference

To be written.

### `Mocker`

### `ContactMock`

### `RoomMock`

### `MessageMock`

## History

### master v0.9 (Sep 15, 2021)

1. ES Modules support

### v0.4 (July 27, 2020)

1. Add the [Math Master Example](examples/math-master.ts).
1. Support `EnvironmentMock` for `createFixture(...)`

### v0.2 (July 25, 2020)

1. Move `createFixture` from [wechaty](https://github.com/wechaty/wechaty) and `mocker.*` from [wechaty-puppet-mock](https://github.com/wechaty/wechaty-puppet-mock) to prevent circler dependencies.

## Author

[Huan LI](https://github.com/huan) ([李卓桓](http://linkedin.com/in/zixia)), Tencent TVP of Chatbot, \<zixia@zixia.net\>

[![Profile of Huan LI (李卓桓) on StackOverflow](https://stackexchange.com/users/flair/265499.png)](https://stackexchange.com/users/265499)

## Copyright & License

* Code & Docs © 2020 Huan LI \<zixia@zixia.net\>
* Docs released under Creative Commons
* Code released under the Apache-2.0 License
