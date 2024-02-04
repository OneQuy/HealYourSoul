import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// screen names

export enum ScreenName {
  Comic = 'Warm', // draw
  Meme = 'Meme',
  Awesome = 'Awesome',
  Typo = 'Typography',
  Info = 'Infographic',
  Sunset = 'Nature',
  Quote = 'Motivation',
  CatDog = 'Animal',
  Love = 'Love',
  Satisfying  = 'Satisfying',
  NSFW = 'NSFW',
  Art = 'Art',
  Cute = 'Cute',
  Sarcasm = 'Sarcasm',
  IAPPage = 'Support App',
  WikiFact = 'Random Wikipedia',
  ShortFact = 'Fun Fact', // ninja fact
  Picture = 'Random Picture', // unsplash
  Joke = 'Joke', // ninja joke
  QuoteText = 'Quote',
  Trivia = 'Trivia',
  AwardPicture = 'Photos of Year',
  FunWebsite = 'Fun Website',
  TopMovie = 'Top 250 Movies',
  BestShortFilms = 'Good Short Film',
  RandomMeme = 'Random Meme',
  Setting = 'Setting',
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
  ListFile_Awesome = LocalPath.MasterDirName + '/awesome/list.json',
  ListFile_Typo = LocalPath.MasterDirName + '/typo/list.json',
  ListFile_Info = LocalPath.MasterDirName + '/info/list.json',
  ListFile_Sunset = LocalPath.MasterDirName + '/sunset/list.json',
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
  ListFile_Awesome = 'awesome/list.json',
  ListFile_Info = 'info/list.json',
  ListFile_Typo = 'typo/list.json',
  ListFile_Sunset = 'sunset/list.json',
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
  Version_Sunset = 'app/versions/sunset',
  Version_Typo = 'app/versions/typo',
  Version_Info = 'app/versions/info',
  Version_Awesome = 'app/versions/awesome',
}

// category

export enum Category {
  Draw = 0, // warm
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
  Awesome = 22,
  Typo = 23,
  Info = 24,
  Sunset = 25,
}

// margin / padding

export enum Outline {
  Horizontal = wp('4%'),
  
  VerticalMini = hp('0.7%'),
  Vertical = hp(3.5),

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
  IconTiny = 15,
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
  ShareImage = 'share-variant-outline',
  ThreeDots = 'dots-horizontal',
  NoInternet = 'access-point-network-off',
  HeartBroken = 'heart-broken',
  Dice = 'dice-5-outline',
  Download = 'arrow-down',
  X = 'close-thick',
  Check = 'check-bold',
  List = 'format-list-bulleted-square',
  Right = 'chevron-right',
  Left = 'chevron-left',
  // Book = 'checkbook',
  Link = 'link-variant',
  Eye = 'eye-outline',
  Star = 'star',
  Coffee = 'coffee',
  CheckBox_Yes = 'checkbox-marked-outline',
  CheckBox_No = 'checkbox-blank-outline',

  // MaterialIcons

  ArrowLeft = 'keyboard-arrow-left',
  ArrowRight = 'keyboard-arrow-right',
  Pause = 'pause',
  Play = 'play-arrow',
  VolumeOff = 'volume-off',
  VolumeUp = 'volume-up',
  Copy = 'content-copy',
  Setting = 'settings',
}

export const LocalText = {
  offline_mode: "Offline mode",
  you_are_offline: "You are offline",
  retry: "Retry",
  update: "Update",
  update_title: "New version is available!",
  update_content: "Please update the app to the latest version for the best experience.",
  learn_more: "Learn more",
  enable_all: "Enable all",
  remove_screen_intro: "Tap to enable/disable screens:",
  toggle_screen: "Toggle screen",
  send: "Send",
  share_app: "Share Gooday",
  like: "Like",
  close: "Close",
  rate_app: "Rate app",
  Contact: "Contact",
  lights_mode: "Light mode",
  darks_mode: "Dark mode",
  specials_theme: "Special theme",
  install_app_date: "The date you installed Gooday",
  logo_credit: "Turtle app logo created by",
  myself_credit: 'made by @onequy with ❤️ & café.\nThank you for enjoying Gooday!',
  notification: "Notification",
  anim_load_media: "Animation show media",
  notification_quote_of_the_day: "Quote of the day",
  notification_quote_of_the_day_desc: 'Send a quote at #:00 AM daily. (Tap this to test)',
  notification_fact_of_the_day: "Fact of the day",
  notification_fact_of_the_day_desc: 'Send a fun fact at #:00 daily. (Tap this to test)',
  notification_joke_of_the_day: "Joke of the day",
  notification_joke_of_the_day_desc: 'Send a joke at #:00 daily. (Tap this to test)',
  community: "Community",
  community_content: "Follow to get latest news about Gooday",
  feedback: "Feedback",
  feedback_info: "You can report issues or suggest features to me here. I really appreciate it!",
  error: "Error",
  credit_to_author: 'Credit to the author.',
  credit_to: 'Credit to',
  error_toast: 'Something\'s wrong',
  tap_to_retry: 'Tap to retry.',
  no_internet: 'No internet!',
  cant_get_content: 'Cant get the content!',
  thank_iap: 'Your purchase is successful! Thank you so much for this support!',
  done: 'Done!',
  you_are_awesome: 'You are awsome!!',
  donate_me: 'Buy me a coffee',
  theme: 'Theme',
  great: 'Great!!',
  you_rock: 'You rock!!',
  cool: 'Cool!',
  copied: 'Copied!',
  copy: 'Copy',
  later: 'Later',
  share: 'Share',
  got_it: 'Got it!',
  open_youtube: 'Open in Youtube',
  share_image: 'Share Image',
  random: 'Random',
  next: 'Next',
  previous: 'Previous',
  read_full: 'Read Full',
  view: 'View',
  saved: 'Saved!',
  setting: 'Setting',
  animation: 'Animation',
  rate_me: 'Rate app',
  save: 'Save',
  no_media_to_download: 'No media to download!',
  oops: 'Oooops',
  fact_of_the_day: 'Fact of the day',
  winners: 'Winners',
  fun_websites: 'Fun Websites',
  top_movies: 'Top 250 Movies',
  best_short_films: 'Best Short Films',
  
  premium_benefit: 'Hi there, I am @onequy, an indie developer from Vietnam. I developed this app to spread fun, useful information, and positive things to everyone around the world. I am trying my best to keep the app free for as long as possible. However, I would be really happy and grateful if you subscribe and want to:',
  subscribe_for: 'Subscribe for',
  today: 'Today',
  warning_premium: 'These subscriptions are non-renewable. If you no longer wish to subscribe, it will be automatically canceled at the end of the period.',
  thank_you_premium: "Any purchase is greatly appreciated. Thank you 💛",

  // ad_free: 'Ad-free',
  // no_ad_anymore: 'No ad during your subscription time.\n',
  
  support_me: 'Support app',
  support_me_info: "Support me in covering the monthly costs of the operation and data server.",
  
  give_coffee: 'Buy me a coffee',
  give_coffee_info: "It will be great motivation for me to improve the app every day.",
  
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

  start_gooday: 'Start to good your day!',
  color: 'Color',
  welcome_text: 'Welcome to',
  welcome_text_2: `Your daily dose of laughter and positivity!`,
  welcome_text_3: `In Gooday, I believe in the power of laughter, positive and beautiful stuffs to brighten your day and lift your spirits. Dive into a world filled with hilarious memes, gorgeous pictures, useful and heartwarming content that is sure to heal your soul and bring a smile to your face.`,
  set_your_theme: 'Pick your own theme',
  
  introduce_text: 'Introduce screen',
  introduce_Draw: 'Warm is the screen that contains images and video of heartwarming moments, hope this will heal your soul even a little! 🌈',
  introduce_BestShortFilms: 'Discover cinematic excellence with "Good Short Films" showcasing carefully curated and selectively chosen award-winning gems on YouTube and other streaming platforms 🎬',
  introduce_Wikipedia: 'Learn something new everyday!\n\nLet\'s read at least one Wikipedia post daily. It will increase your knowledge day by day and help you develop a good habit! 📖',
  introduce_FunWebsites: "Getting boring? Discover the globe's most entertaining corners with Fun Websites screen! Explore the best of the web's playful side. Unleash a world of laughter, games, and surprises at your fingertips. You can press the [View] button to try it out right in the app. 🌐",
  introduce_AwardPicture: "Elevate your visual senses with our Award-Winning Pictures of the Year screen!\n\nImmerse yourself in a curated collection of the most captivating and awe-inspiring images that have earned accolades globally. Witness the world through the lens of excellence, one breathtaking photo at a time. 📸✨",
  
  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',
  
  popup_title_error: 'Ooops!',
  popup_content_error: "Uh-oh! Something went wrong. We're fixing it. Thanks for your patience!",

  popup_content_sent_feedback: 'Thank you for taking the time to provide feedback! Your input is valuable and helps us improve.',
  popup_content_sent_feedback_error_hour: 'You just sent feedback recently. Please send another one at least in the next hour. Thank you!',
}

// storage

export const StorageKey_AwardPictureLastSeenIdxOfYear = (year: number) => 'award_picture_last_seen_idx_' + year
export const StorageKey_LocalFileVersion = (cat: Category) => 'local_file_version_' + cat
export const StorageKey_ShowedIntroduceCat = (cat: Category) => 'introduce_' + cat

export const StorageKey_NinjaFact_ToggleNoti = 'ninja_fact_ToggleNoti'
export const StorageKey_NinjaJoke_ToggleNoti = 'ninja_joke_ToggleNoti'
export const StorageKey_Quote_ToggleNoti = 'quote_ToggleNoti'

export const StorageKey_NinjaFact = 'ninja_fact_arr'
export const StorageKey_NinjaJoke = 'ninja_joke_arr'
export const StorageKey_Quote = 'quote_arr'

export const StorageKey_NinjaFact_DataNoti = 'ninja_fact_arr_noti'
export const StorageKey_NinjaJoke_DataNoti = 'ninja_joke_arr_noti'
export const StorageKey_Quote_DataNoti = 'quote_arr_noti'

export const StorageKey_NinjaFact_LastDateDownload_DataNoti = 'ninja_fact_arr_noti_date'
export const StorageKey_NinjaJoke_LastDateDownload_DataNoti = 'ninja_joke_arr_noti_date'
export const StorageKey_Quote_LastDateDownload_DataNoti = 'quote_arr_noti_date'

export const StorageKey_IsAnimLoadMedia = 'IsAnimLoadMedia'
export const StorageKey_WasteTimeItems = 'waste_time_item'
export const StorageKey_Streak = 'streak'
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
export const StorageKey_Rated = 'rated'
export const StorageKey_LastTickSendFeedback = 'feedback_tick'
export const StorageKey_PremiumBgID = 'premium_bg_ids'
export const StorageKey_UserID = 'user_id'