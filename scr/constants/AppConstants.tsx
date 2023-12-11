import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// screen names

export enum ScreenName {
  Comic = 'Warm',
  Meme = 'Meme',
  Quote = 'Quotes',
  CatDog = 'Meow. Doggo. Animals',
  Love = 'Love',
  Satisfying  = 'Satisfying',
  NSFW = 'NSFW',
  IAPPage = 'Premium'
}

// dir / file

export enum LocalPath {
  MasterDirName = 'master_dir',
  ListFile_Draw = LocalPath.MasterDirName + '/draw/list.json',
  ListFile_Meme = LocalPath.MasterDirName + '/meme/list.json',
  ListFile_Quote = LocalPath.MasterDirName + '/quote/list.json',
  ListFile_CatDog = LocalPath.MasterDirName + '/catdog/list.json',
  ListFile_Love = LocalPath.MasterDirName + '/love/list.json',
  ListFile_Satisfying = LocalPath.MasterDirName + '/satisfying/list.json',
  ListFile_NSFW = LocalPath.MasterDirName + '/nsfw/list.json',
}

export enum FirebasePath {
  ListFile_Draw = 'draw/list.json',
  ListFile_Meme = 'meme/list.json',
  ListFile_Quote = 'quote/list.json',
  ListFile_CatDog = 'catdog/list.json',
  ListFile_Love = 'love/list.json',
  ListFile_Satisfying = 'satisfying/list.json',
  ListFile_NSFW = 'nsfw/list.json',
}

export enum FirebaseDBPath {
  Version_Draw = 'app/versions/draw',
  Version_Meme = 'app/versions/meme',
  Version_Quote = 'app/versions/quote',
  Version_CatDog = 'app/versions/catdog',
  Version_Love = 'app/versions/love',
  Version_Satisfying = 'app/versions/satisfying',
  Version_NSFW = 'app/versions/nsfw',
}

// category

export enum Category {
  Draw = 0,
  Meme = 1,
  Quote = 2,
  CatDog = 3,
  Love = 4,
  Satisfying = 5,
  NSFW = 6,
}

// margin / padding

export enum Outline {
  Horizontal = wp('4%'),
  VerticalMini = hp('0.7%'),

  GapVertical = hp('1%'),
  GapVertical_2 = hp('2%'),
  
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

// border radius

export enum BorderRadius {
 BR = wp('4%'),
}

// font size

export enum FontSize {
  Big = wp('7%'),
  Normal = wp('5%'),
  Small_L = wp('4%'),
  Small = wp('3%'),
}

// font weight

export enum FontWeight {
  Bold = 'bold',
  B600 = '600'
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
  
  premium_benefit: 'Why I need Premium?',
  select_premium: 'Select a subscription that suits to you:',
  thank_you_premium: 'Any subscription always supports me a lot. Thank you so much!',

  ad_free: 'Ad-free',
  no_ad_anymore: 'No ads during your subscription time',
  
  support_me: 'Support app',
  support_me_info: 'Support me to pay the cost of the app server',
  
  give_coffee: 'Give me a cup of coffee!',
  give_coffee_info: 'I really appreciate it. Thank you!',
  
  one_month: '1 Month',
  six_month: '6 Months',
  twelve_month: '12 Months',


  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',
}