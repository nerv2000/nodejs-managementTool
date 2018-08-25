'use strict'
const json5 = require('json5');
const fs = require('fs');

module.exports = {
  load: function() {
    return json5.parse(fs.readFileSync("./config/config.json5", "utf-8"));
  }
}
