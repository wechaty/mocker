import {
  createFixture,
  VERSION,
}               from 'wechaty-mocker'

async function main () {
  try {
    for await (const fixture of createFixture()) {
      void fixture
      console.info(`Smoke Testing PASSED!`)
    }

    if (VERSION === '0.0.0') {
      throw new Error('version not set right before publish!')
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
