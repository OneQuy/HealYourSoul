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
  Art = 'Art',
  Cute = 'Cute',
  Sarcasm = 'Sarcasm',
  IAPPage = 'Premium',
  ShortFact = 'Random Fact', // ninja fact
  Picture = 'Random Picture', // unsplash
  Joke = 'Random Joke', // ninja joke
  Trivia = 'Trivia', // ninja joke
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
  ListFile_Cute = LocalPath.MasterDirName + '/cute/list.json',
  ListFile_Art = LocalPath.MasterDirName + '/art/list.json',
  ListFile_Sarcasm = LocalPath.MasterDirName + '/sarcasm/list.json',
}

export enum FirebasePath {
  ListFile_Draw = 'draw/list.json',
  ListFile_Meme = 'meme/list.json',
  ListFile_Quote = 'quote/list.json',
  ListFile_CatDog = 'catdog/list.json',
  ListFile_Love = 'love/list.json',
  ListFile_Satisfying = 'satisfying/list.json',
  ListFile_NSFW = 'nsfw/list.json',
  ListFile_Art = 'art/list.json',
  ListFile_Cute = 'cute/list.json',
  ListFile_Sarcasm = 'sarcasm/list.json',
}

export enum FirebaseDBPath {
  Version_Draw = 'app/versions/draw',
  Version_Meme = 'app/versions/meme',
  Version_Quote = 'app/versions/quote',
  Version_CatDog = 'app/versions/catdog',
  Version_Love = 'app/versions/love',
  Version_Satisfying = 'app/versions/satisfying',
  Version_NSFW = 'app/versions/nsfw',
  Version_Cute = 'app/versions/cute',
  Version_Art = 'app/versions/art',
  Version_Sarcasm = 'app/versions/sarcasm',
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
  Cute = 7,
  Sarcasm = 8,
  Art = 9,
  NinjaFact = 10,
  Picture = 11,
  NinjaJoke = 12,
  Trivia = 13,
}

// margin / padding

export enum Outline {
  Horizontal = wp('4%'),
  VerticalMini = hp('0.7%'),

  GapVertical = hp('1%'),
  GapVertical_2 = hp('2%'),
  
  GapHorizontal = wp('1%'),
}

// size

export enum Size {
  WP100 = wp('100%'),
  IconBig = 50,
  Icon = 25,
  IconSmaller = 20,
}

// opacity

export enum Opacity {
 Primary = 0.8,
}

// border radius

export enum BorderRadius {
 BR8 = 8,
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
  B600 = '600',
  B500 = '500'
}

// need reload reason

export enum NeedReloadReason {
  None,
  NoInternet,
  FailToGetContent
}

// texts

export enum Icon {
  // MaterialCommunityIcons

  ShareText = 'share',
  ShareImage = 'share-variant',
  ThreeDots = 'dots-horizontal',
  NoInternet = 'access-point-network-off',
  HeartBroken = 'heart-broken',
  Dice = 'dice-5-outline',
  Download = 'download',

  // MaterialIcons

  ArrowLeft = 'keyboard-arrow-left',
  ArrowRight = 'keyboard-arrow-right',
  Pause = 'pause',
  Play = 'play-arrow',
  VolumeOff = 'volume-off',
  VolumeUp = 'volume-up',
  Copy = 'content-copy',
}

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
  copy: 'Copy',
  share: 'Share',
  share_image: 'Share Image',
  random: 'Random',
  saved: 'Saved!',
  save: 'Save',
  no_media_to_download: 'No media to download!',
  oops: 'Oooops',
  fact_of_the_day: 'Fact of the day',
  
  premium_benefit: 'Hi there, I am Minh Quy, an indie developer from Vietnam. I created this app to spread fun, useful, and positive things to everyone. Whether you are happy, sad, or feeling something else, I hope from the bottom of my heart that you will feel even better. Everything will be okay. The app is always free. But I would be really happy if you subscribe and want to:',
  subscribe_for: 'Subscribe for',
  today: 'Today',
  warning_premium: 'These subscriptions are not renewable. If you dont want to subcribe anymore, it will be canceled on the end of the period automatically.',
  thank_you_premium: 'Any subscription always supports me a lot. Thank you so much!',

  ad_free: 'Ad-free',
  no_ad_anymore: 'No ad during your subscription time.',
  
  support_me: 'Support app',
  support_me_info: "Support me in covering the cost of the data server every month.",
  
  give_coffee: 'Give me a cup of coffee!',
  give_coffee_info: "It will be a great motivation for me to improve the app every day.",
  
  one_month: '1 Month',
  six_month: '6 Months',
  twelve_month: '12 Months',
  
  you_subscribed: 'You subscribed:',
  subscribed_date: 'Subscribed date:',
  subscribed_exp_date: 'Expired date:',
  day_left: 'Day(s) left:',
  
  thank_you: 'Your subscription means the world to me! It really makes my day. Thank you for supporting my app.',

  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',
}

export const StorageKey_Streak = 'streak'
