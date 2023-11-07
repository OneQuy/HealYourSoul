import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// screen names

export enum ScreenName {
  Comic = 'Warm',
  Meme = 'Meme',
  Quote = 'Quotes',
}

// margin / padding

export enum Outline {
  Horizontal = wp('4%'),
  VerticalMini = hp('0.7%'),

  GapVertical = hp('1%'),
  GapHorizontal = wp('1%'),

  BorderRadius = 8,
}

// size

export enum Size {
  WP100 = wp('100%'),
  Icon = 25,
  IconSmaller = 20,
}

// opacity

export enum Opacity {
 Primary = 0.8,
}

// font size

export enum FontSize {
  Big = wp('7%'),
  Normal = wp('5%'),
  Small = wp('3%'),
}

// dir / file

export enum LocalPath {
  MasterDirName = 'master_dir',
  ListFile_Draw = LocalPath.MasterDirName + '/draw/list.json',
  ListFile_Meme = LocalPath.MasterDirName + '/meme/list.json',
  ListFile_Quote = LocalPath.MasterDirName + '/quote/list.json'
}

export enum FirebasePath {
  ListFile_Draw = 'draw/list.json',
  ListFile_Meme = 'meme/list.json',
  ListFile_Quote = 'quote/list.json',
}

export enum FirebaseDBPath {
  Version_Draw = 'app/versions/draw',
  Version_Meme = 'app/versions/meme',
  Version_Quote = 'app/versions/quote'
}

// category

export enum Category {
  Draw = 0,
  Meme = 1,
  Quote = 2
}

// need reload reason

export enum NeedReloadReason {
  None,
  NoInternet,
  FailToGetContent
}

// texts

export const LocalText = {
  offline_mode: "Offline mode",
  you_are_offline: "You are offline",
  retry: "Retry",
  error: "Error",
  credit_to_author: 'Credit to the author.',
  error_toast: 'Something\'s wrong',
  tap_to_retry: 'Tap to retry.',
  no_internet: 'No internet!',
  cant_get_content: 'Cant get the content!',
  copied: 'Copied!',
  saved: 'Saved!',
  no_media_to_download: 'No media to download!',
  oops: 'Oooops',


  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',
}