const { PullAllAsync } = require("./src/PullData");
const { UploadPostAsync } = require("./src/Push");
const { GenDataPictureOfTheYear } = require("./src/GeneratePictureOfTheYear")
const { Wiki } = require("./src/tmp")
const { LogRed } = require("./src/Utils_NodeJS");
const { IsParamExist, GetParam, } = require("./src/common/Utils");

async function JustDoIt() {
  if (IsParamExist('pull'))
    await PullAllAsync()
  else if (IsParamExist('tmp')) {
    Wiki()
  }
  else if (IsParamExist('award-pic')) {
    GenDataPictureOfTheYear()
  }
  else if (IsParamExist('push')) {
    let cat

    if (IsParamExist('quote'))
      cat = 'quote'
    else if (IsParamExist('draw'))
      cat = 'draw'
    else if (IsParamExist('meme'))
      cat = 'meme'
    else if (IsParamExist('catdog'))
      cat = 'catdog'
    else if (IsParamExist('love'))
      cat = 'love'
    else if (IsParamExist('satisfying'))
      cat = 'satisfying'
    else if (IsParamExist('nsfw'))
      cat = 'nsfw'
    else if (IsParamExist('cute'))
      cat = 'cute'
    else if (IsParamExist('art'))
      cat = 'art'
    else if (IsParamExist('sarcasm'))
      cat = 'sarcasm'
    else {
      LogRed('no specify the cat to upload');
      return
    }

    const author = GetParam('a')
    const link = GetParam('l')
    const tittle = GetParam('t')
    const fromImgURL = GetParam('wi')
    const fromVideoURL = GetParam('wv')
    const smartAuthor = GetParam('sa')
    const notDel = IsParamExist('nd')
    const onlyOverrideLatestMedia = IsParamExist('ol')

    await UploadPostAsync(cat, tittle, author, link, notDel, smartAuthor, fromImgURL, fromVideoURL, onlyOverrideLatestMedia)
  }
  else
    LogRed('no command to execute!');
}

JustDoIt();

