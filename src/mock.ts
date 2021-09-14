import { mock } from 'wechaty-puppet-mock'

import MessageMock = mock.MessageMock
import ContactMock = mock.ContactMock
import RoomMock = mock.RoomMock

import Mocker = mock.Mocker
import SimpleEnvironment = mock.SimpleEnvironment

type EnvironmentMock = mock.EnvironmentMock

export type {
  EnvironmentMock,
}
export {
  RoomMock,
  ContactMock,
  MessageMock,

  Mocker,
  SimpleEnvironment,
}
