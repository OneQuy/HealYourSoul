const { PullAllAsync } = require("./src/PullData");
const { IsParamExist, } = require("./src/common/Utils");

async function JustDoIt() {
  if (IsParamExist('pull'))
    await PullAllAsync()
  else
    console.log('no command to execute!');
}

JustDoIt();