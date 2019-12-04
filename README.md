# Wechaty-mock-core (WIP)

## What is this?

This is an essential component when you are trying to test your wechaty puppet implementation. This project is aim to provide a tool that helps you mock a wechat account, which could mock an account with mock contacts and mock rooms, and generate messages (in different types), events (like friendship events, room events etc) for you.

## Why do we need this?

Currently there are several wechaty puppets available, like `wechaty-puppet-macpro` or `wechaty-puppet-padplus`, but we don't know how many instance we could run on a 2 core cpu 4G memory machine, when it came to industry usage of these project, the performance is a key attribute. The reason that we don't know the answer to the question is that we can not evaluate this, there is no test server that we can use since we are trying to connect to Wechat. Thus we need a mock tool to mock these things so we can do some pressure testing on our puppet code, then we will have confidence to say how many wechat accounts could be run on a 2 core cpu 4G memory machine. From that point, we will be able to find a number to optimize.

## Features

* Generate wechat account, includes `wxid`, `name`, `weixin`, `avatar`, `gender`
* Generate contacts and rooms: according to config (contact count, room count, room member distribution)
* Emit messages: according to config (frequency, message types, room message ratio and contact message ratio)
* Emit friendship events: according to config (frequency) emit friendship events
* Emit room events; according to config (frequency of different room events)
