import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// screen names

export enum ScreenName {
  Comic = 'Warm',
  Meme = 'Meme',
  RedditMeme = 'Reddit Meme',
  Quote = 'Motivation',
  CatDog = 'Cat. Dog. Animal',
  Love = 'Love',
  Satisfying  = 'Satisfying',
  NSFW = 'NSFW',
  Art = 'Art',
  Cute = 'Wholesome. Cute',
  Sarcasm = 'Sarcasm',
  IAPPage = 'Premium',
  WikiFact = 'Random Wikipedia',
  ShortFact = 'Fun Fact', // ninja fact
  Picture = 'Random Picture', // unsplash
  Joke = 'Random Joke', // ninja joke
  QuoteText = 'Random Quote',
  Trivia = 'Trivia',
  AwardPicture = 'Photos of Year',
  FunWebsite = 'Fun Websites',
  TopMovie = 'Top 250 Movies',
  BestShortFilms = 'Best Short Films',
  RandomMeme = 'Random Meme',
  // Reminder = 'Reminder', // i wasted so much time
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
  Quotetext = 14,
  RedditMeme = 15,
  AwardPicture = 16,
  Wikipedia = 17,
  FunWebsites = 18,
  TopMovie = 19,
  BestShortFilms = 20,
  RandomMeme = 21,
  // Reminder = 14,
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
  IconMedium = 35,
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
  Youtube = 'youtube',
  ShareImage = 'share-variant',
  ThreeDots = 'dots-horizontal',
  NoInternet = 'access-point-network-off',
  HeartBroken = 'heart-broken',
  Dice = 'dice-5-outline',
  Download = 'download',
  X = 'close-thick',
  Check = 'check-bold',
  List = 'format-list-bulleted-square',
  Right = 'skip-next',
  Left = 'skip-previous',
  Book = 'checkbook',
  Link = 'link-variant',
  Eye = 'eye-outline',

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
  update: "Update",
  update_title: "New version is available!",
  update_content: "Please update the app to the latest version for the best experience.",
  learn_more: "Learn more",
  error: "Error",
  credit_to_author: 'Credit to the author.',
  credit_to: 'Credit to',
  error_toast: 'Something\'s wrong',
  tap_to_retry: 'Tap to retry.',
  no_internet: 'No internet!',
  cant_get_content: 'Cant get the content!',
  thank_iap: 'Your purchase is successful! Thank you so much for this support!',
  you_are_awesome: 'You are awsome!!',
  donate_me: 'Donate / Support',
  theme: 'Theme',
  great: 'Great!!',
  you_rock: 'You rock!!',
  cool: 'Cool!',
  copied: 'Copied!',
  copy: 'Copy',
  later: 'Later',
  share: 'Share',
  open_youtube: 'Open in Youtube',
  share_image: 'Share Image',
  random: 'Random',
  next: 'Next',
  read_full: 'Read Full',
  go: 'Go!',
  saved: 'Saved!',
  save: 'Save',
  no_media_to_download: 'No media to download!',
  oops: 'Oooops',
  fact_of_the_day: 'Fact of the day',
  winners: 'Winners',
  fun_websites: 'Fun Websites',
  top_movies: 'Top 250 Movies',
  best_short_films: 'Best Short Films',
  
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
  
  difficulty: 'Difficulty',
  all: 'All',
  hard: 'Hard',
  medium: 'Medium',
  easy: 'Easy',
  
  answer_type: 'Answers type:',
  multi_choice: 'Multi-choice',
  true_false: 'True/False',

  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',
}

// storage

export const StorageKey_AwardPictureLastSeenIdxOfYear = (year: number) => 'award_picture_last_seen_idx_' + year
export const StorageKey_LocalFileVersion = (cat: Category) => 'local_file_version_' + cat

export const StorageKey_Streak = 'streak'
export const StorageKey_WasteTimeItems = 'waste_time_item'
export const StorageKey_SelectingFunWebsiteId = 'selecting_fun_website_id'
export const StorageKey_SelectingTopMovieIdx = 'selecting_movie_idx'
export const StorageKey_SelectingShortFilmIdx = 'selecting_short_film_idx'

export const StorageKey_TriviaDifficulty = 'trivia_diff'
export const StorageKey_TriviaAnswerType = 'trivia_type'
export const StorageKey_StartupAlertID = 'startup_alert_id'
export const StorageKey_LastTimeCheckAndReloadAppConfig = 'tick_reloaded_config'
export const StorageKey_LastTimeCheckFirstOpenAppOfTheDay = 'lasttime_check_first_open_app_day'
export const StorageKey_FirstTimeInstallTick = 'first_time_install'
export const StorageKey_LastInstalledVersion = 'last_version'
export const StorageKey_LastAskForUpdateApp = 'ask_for_update_app'
export const StorageKey_ForceDev = 'force_dev'