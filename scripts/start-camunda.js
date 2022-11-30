import { startCamunda, stopCamunda } from 'run-camunda'
import { existsSync } from 'node:fs'
import pkg from 'fs-extra'

const { removeSync, copySync } = pkg

const RUN_CAMUNDA_DEFAULT_PATH = './.run-camunda'

function updateCamundaRunResources () {
  removeSync(`${RUN_CAMUNDA_DEFAULT_PATH}/dist/configuration/resources`)

  copySync(
    './camunda/resources',
    `${RUN_CAMUNDA_DEFAULT_PATH}/dist/configuration/resources`,
    { overwrite: true }
  )

  copySync(
    './camunda/default.yml',
    `${RUN_CAMUNDA_DEFAULT_PATH}/dist/configuration/default.yml`,
    { overwrite: true }
  )

  console.log('Camunda resources folder and default.yml updated.')
}

async function downloadCamunda () {
  console.log('Camunda Run has not yet been downloaded. Please wait a few seconds.')

  await startCamunda()

  console.log('Force Camunda Run to restart to update resources...')

  await stopCamunda()
}

async function start () {
  const isCamundaDownloaded = existsSync(RUN_CAMUNDA_DEFAULT_PATH)

  if (!isCamundaDownloaded) {
    /** force run-camunda to start and stop to download Camunda Run before move resources */
    await downloadCamunda()
  }

  updateCamundaRunResources()

  await startCamunda()
}

start()
