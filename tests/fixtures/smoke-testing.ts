import {
  createFixture,
  VERSION,
}               from 'wechaty-mocker'

async function main () {
  try {
    if (VERSION === '0.0.0') {
      throw new Error('version not set right before publish!')
    }

    for await (const fixture of createFixture()) {
      console.info(`Smoke Testing PASSED!`)
    }

    return 0

  } catch (e) {
    console.error(e)
    return 1
  }
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
