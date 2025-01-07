import fs from 'fs'
// const fs = require('fs')
while (true) {
  try {
    // change tfjs-node-gpu to tfjs-node
    fs.renameSync('./node_modules/@tensorflow/tfjs-node/lib/napi-v8', './node_modules/@tensorflow/tfjs-node/lib/napi-v9')
    break
  } catch (e) {
console.log(e.message)
  }
}
console.log('done')