#!/usr/bin/env ts-node
import test from 'blue-tape'

import {
  Mocker,
}               from '../src/mod'

test('integrate testing', async t => {
  const mocker = new Mocker()
  t.ok(mocker, 'should instantiated ok')
})
