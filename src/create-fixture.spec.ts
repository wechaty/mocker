#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
  sinon,
}                         from 'tstest'

import {
  impl,
}                         from 'wechaty'
import * as PUPPET        from 'wechaty-puppet'
import {
  mock,
}                         from 'wechaty-puppet-mock'

import { createFixture }  from './create-fixture.js'

test('createFixture() initial state', async (t) => {
  for await (const fixture of createFixture()) {
    t.ok(impl.MessageImpl.valid(fixture.wechaty.message), 'should have message instance')
    t.equal(fixture.wechaty.message.type(), PUPPET.type.Message.Text, 'should have message with text type')
    t.equal(typeof fixture.wechaty.message.text(), 'string', 'should have message with text content')

    t.equal(fixture.wechaty.message.talker().id, fixture.mocker.player.id, 'should get a message send from player')
    t.equal(fixture.wechaty.message.to()!.id, fixture.mocker.bot.id, 'should get a message send to bot')
    t.false(fixture.wechaty.message.room(), 'should get a message as direct message')

    t.equal(fixture.moList.length, 0, 'should be empty mo list')
    t.equal(fixture.mtList.length, 0, 'should be empty mt list')

    t.ok(fixture.mocker.bot instanceof mock.ContactMock, 'should get mock contact mary')
    t.ok(fixture.mocker.player instanceof mock.ContactMock, 'should get mock contact mike')
  }
})

test('createFixture() Mobile Originated', async (t) => {
  for await (const fixture of createFixture()) {
    const spy = sinon.spy()
    fixture.wechaty.wechaty.on('message', spy)

    fixture.mocker.bot.say().to(fixture.mocker.player)
    await new Promise(setImmediate)

    t.ok(spy.called, 'should received message event')
    t.equal(spy.args[0]![0].from().id, fixture.mocker.bot.id, 'should get bot as from')
    t.equal(spy.args[0]![0].to().id, fixture.mocker.player.id, 'should get player as to')

    t.equal(fixture.moList.length, 1, 'should be 1 mo')
    t.equal(fixture.mtList.length, 0, 'should be empty mt list')
    t.equal(fixture.moList[0]!.id, spy.args[0]![0].id, 'should get the same message instance')
  }
})

test('createFixture() Mobile Terminated', async (t) => {
  for await (const fixture of createFixture()) {
    const spy = sinon.spy()
    fixture.wechaty.wechaty.on('message', spy)

    fixture.mocker.player.say().to(fixture.mocker.bot)
    await new Promise(setImmediate)

    t.ok(spy.called, 'should received message event')
    t.equal(spy.args[0]![0].to().id, fixture.mocker.bot.id, 'should get bot as to')
    t.equal(spy.args[0]![0].from().id, fixture.mocker.player.id, 'should get player as from')

    t.equal(fixture.moList.length, 0, 'should be 0 mo')
    t.equal(fixture.mtList.length, 1, 'should be 1 mt')
    t.equal(fixture.mtList[0]!.id, spy.args[0]![0].id, 'should get the same message instance')
  }
})

test('user.say() multiple times with moList', async t => {
  for await (const fixture of createFixture()) {
    const TEXT_LIST = [
      'one',
      'two',
      'three',
    ]
    for (const text of TEXT_LIST) {
      await fixture.mocker.bot.say(text).to(fixture.mocker.player)
    }
    await new Promise(setImmediate)

    t.equal(fixture.moList.length, TEXT_LIST.length, 'should receive all TEXT_LIST')
    for (let i = 0; i < TEXT_LIST.length; i++) {
      t.ok(fixture.moList[i], `should exist moList for ${i}`)
      t.same(fixture.moList[i]!.text(), TEXT_LIST[i], `should get TEXT_LIST[${i}]: ${TEXT_LIST[i]}`)
    }
  }
})

test('Contact.find() mocker.createContacts()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of createFixture()) {
    const existingContactList = await wechaty.wechaty.Contact.findAll()
    const existingNum = existingContactList.length

    const CONTACTS_NUM = 3
    const [mike] = mocker.mocker.createContacts(CONTACTS_NUM) as [mock.ContactMock]

    const contactList = await wechaty.wechaty.Contact.findAll()
    t.equal(contactList.length, existingNum + CONTACTS_NUM, 'should find all contacts create by mocker: ' + existingNum + CONTACTS_NUM)

    const contact = await wechaty.wechaty.Contact.find({ name: mike.payload.name })
    t.ok(contact, 'should find a contact by name of mike')
    t.equal(contact!.id, mike.id, 'should find the contact the same id as mike')
  }
})

test('Room.find() mocker.createRooms()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of createFixture()) {
    const existingRoomList = await wechaty.wechaty.Room.findAll()
    const existingNum = existingRoomList.length

    const ROOMS_NUM = 5
    const [starbucks] = mocker.mocker.createRooms(ROOMS_NUM) as [mock.RoomMock]

    const roomList = await wechaty.wechaty.Room.findAll()
    t.equal(roomList.length, existingNum + ROOMS_NUM, 'should find all rooms create by mocker: ' + existingNum + ROOMS_NUM)

    const room = await wechaty.wechaty.Room.find({ topic: starbucks.payload.topic })
    t.ok(room, 'should find a room by topic of starbucks')
    t.equal(room!.id, starbucks.id, 'should find the room the same id as starbucks')
  }
})

test('Contact.load() mocker.createContact()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of createFixture()) {
    const FILE_HELPER_ID = 'filehelper'

    const filehelper = mocker.mocker.createContact({
      id: FILE_HELPER_ID,
    })

    const contact = await wechaty.wechaty.Contact.find({ id: FILE_HELPER_ID })

    t.ok(contact, 'should load contact by id')
    t.equal(contact!.id, filehelper.id, 'should load contact with id the same as filehelper')

    t.same(contact!.name(), filehelper.payload.name, 'should match the payload between wechaty contact & mock contact')
  }
})

test('Room.load() mocker.createRoom()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of createFixture()) {
    const starbucks = mocker.mocker.createRoom()

    const room = await wechaty.wechaty.Room.find({ id: starbucks.id })

    t.ok(room, 'should load room by id')
    t.equal(room!.id, starbucks.id, 'should load room with id the same as starbucks')

    t.same((room as any).payload, starbucks.payload, 'should match the payload between wechaty room & mock room')
  }
})
