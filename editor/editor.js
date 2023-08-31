const { PullAllAsync } = require("./src/PullData");
const { UploadPostAsync } = require("./src/Push");
const { LogRed } = require("./src/Utils_NodeJS");
const { IsParamExist, GetParam, } = require("./src/common/Utils");

async function JustDoIt() {
  if (IsParamExist('pull'))
    await PullAllAsync()
  else if (IsParamExist('push')) {
    let cat

    if (IsParamExist('quote'))
      cat = 'quote'
    else if (IsParamExist('draw'))
      cat = 'draw'
    else if (IsParamExist('real'))
      cat = 'real'
    else {
      LogRed('no specify the cat to upload');
      return
    }

    const author = GetParam('a')
    const link = GetParam('l')
    const tittle = GetParam('t')
    const notDel = IsParamExist('nd')

    await UploadPostAsync(cat, tittle, author, link, notDel)
  }
  else
    LogRed('no command to execute!');
}

JustDoIt();