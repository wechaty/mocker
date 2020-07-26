#!/usr/bin/env ts-node

import { test }  from 'tstest'

import { createFixture } from '../src/mod'

test('integration testing', async t => {
  for await (const fixture of createFixture()) {
    t.ok(fixture, 'should instantiate wechaty with puppet mocker')
  }
})
