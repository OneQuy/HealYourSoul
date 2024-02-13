const { PullAllAsync, PullByTypeAsync } = require("./src/PullData");
const { UploadPostAsync } = require("./src/Push");
const { GenDataPictureOfTheYear } = require("./src/GeneratePictureOfTheYear")
const { GenDataTopMovies } = require("./src/GenTopMovies")
const { Tmp } = require("./src/tmp")
const { LogRed, LogGreen } = require("./src/Utils_NodeJS");
const { IsParamExist, GetParam, } = require("./src/common/Utils");
const { GenMyInstants } = require("./src/GenMyInstant");

async function JustDoIt() {
  if (IsParamExist('pull')) {
    const cat = GetParam('cat')

    if (cat)
      PullByTypeAsync(cat)
    else {
      LogGreen('starting pull all cat!')

      await PullAllAsync()
    }
  }
  else if (IsParamExist('tmp')) {
    Tmp()
  }
  else if (IsParamExist('award-pic')) {
    GenDataPictureOfTheYear()
  }
  else if (IsParamExist('movie')) {
    GenDataTopMovies()
  }
  else if (IsParamExist('instant')) {
    GenMyInstants()
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
    else if (IsParamExist('awesome'))
      cat = 'awesome'
    else if (IsParamExist('typo'))
      cat = 'typo'
    else if (IsParamExist('info'))
      cat = 'info'
    else if (IsParamExist('sunset'))
      cat = 'sunset'
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

