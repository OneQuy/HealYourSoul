const { PullByTypeAsync } = require("./src/PullData");
const { GetParam, } = require("./src/common/Utils");

async function JustDoIt() {
  const cat = GetParam('cat')
  const start = GetParam('startid', false);
  const end = GetParam('endid', false);

  await PullByTypeAsync(
    cat,
    start,
    end)
}

JustDoIt();