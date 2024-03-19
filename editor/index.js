const { PullAllAsync, PullByTypeAsync } = require("./src/PullData");
const { UploadPostAsync } = require("./src/Push");
const { GenDataPictureOfTheYear } = require("./src/GeneratePictureOfTheYear")
const { GenDataTopMovies } = require("./src/GenTopMovies")
const { Tmp } = require("./src/tmp")
const { LogRed, LogGreen } = require("./src/Utils_NodeJS");
const { IsParamExist, GetParam, } = require("./src/common/Utils");
const { GenMyInstants } = require("./src/GenMyInstant");
const { GenDogBreeds } = require("./src/GenDogBreeds");
const { PullEmojiAllAsync } = require("./src/PullEmoji");

async function JustDoIt() {
  if (IsParamExist('emoji')) {
    PullEmojiAllAsync()
  }
  else if (IsParamExist('pull')) {
    const cat = GetParam('cat')

    if (cat)
      PullByTypeAsync(cat)
    else {
      LogGreen('starting pull all cat!')

      await PullAllAsync()
    }
  }
  else if (IsParamExist('dogbreed')) {
    GenDogBreeds()
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

    if (IsParamExist('quote') || IsParamExist('qu'))
      cat = 'quote'
    else if (IsParamExist('draw') || IsParamExist('dr') || IsParamExist('wa'))
      cat = 'draw'
    else if (IsParamExist('meme') || IsParamExist('me'))
      cat = 'meme'
    else if (IsParamExist('catdog') || IsParamExist('ca'))
      cat = 'catdog'
    else if (IsParamExist('love') || IsParamExist('lo'))
      cat = 'love'
    else if (IsParamExist('satisfying') || IsParamExist('sa'))
      cat = 'satisfying'
    else if (IsParamExist('nsfw') || IsParamExist('ns'))
      cat = 'nsfw'
    else if (IsParamExist('cute') || IsParamExist('cu'))
      cat = 'cute'
    else if (IsParamExist('art') || IsParamExist('ar'))
      cat = 'art'
    else if (IsParamExist('sarcasm') || IsParamExist('sa'))
      cat = 'sarcasm'
    else if (IsParamExist('awesome') || IsParamExist('aw'))
      cat = 'awesome'
    else if (IsParamExist('an'))
      cat = 'awesomenature'
    else if (IsParamExist('typo') || IsParamExist('ty'))
      cat = 'typo'
    else if (IsParamExist('info') || IsParamExist('in'))
      cat = 'info'
    else if (IsParamExist('sunset') || IsParamExist('su'))
      cat = 'sunset'
    else if (IsParamExist('vo'))
      cat = 'vocabulary'
    else if (IsParamExist('tu'))
      cat = 'tune'
    else {
      LogRed('no specify the cat to upload');
      return
    }

    const author = GetParam('a')
    const link = GetParam('l')
    const tittle = GetParam('t')
    const fromImgURL = GetParam('wi')
    const fromVideoURL = GetParam('wv')
    const smartAuthor = GetParam('aa')
    const notDel = IsParamExist('nd')
    const onlyOverrideLatestMedia = IsParamExist('ol')

    await UploadPostAsync(cat, tittle, author, link, notDel, smartAuthor, fromImgURL, fromVideoURL, onlyOverrideLatestMedia)
  }
  else
    LogRed('no command to execute!');
}

JustDoIt();

