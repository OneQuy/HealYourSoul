import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const DaysToAskRate_ForFirstTimeAfterInstalledDays = 1
export const DaysToAskRate_FromSecondTime = 10

export const LimitSaved = 50

export const LimitPagesGalleryLovedPosts = 1

/**
 * time out handle firebase db: 
 * + app config
 * + file versions
 * + get user info, user inboxes,...
 */
export const FirebaseDatabaseTimeOutMs = 5000

export const FileSizeLimitUploadInMb_Image = 2
export const FileSizeLimitUploadInMb_Video = 5

export const NotLimitUploadsValue = -1

// screen names

export enum ScreenName {
  Comic = 'Warm', // draw
  Meme = 'Meme',
  Awesome = 'Awesome',
  AwesomeNature = 'Awesome Nature',
  Tune = 'Tune',
  Typo = 'Typography',
  Info = 'Infographic',
  Sunset = 'Nature',
  Vocabulary = 'Vocabulary',
  Quote = 'Motivation',
  CatDog = 'Animal',
  Love = 'Love',
  Satisfying = 'Satisfying',
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
  Saved = 'Saved',
  FunSound = 'Meme Sounds',
  Upload = 'Upload',
  Inbox = 'Inbox',
  Admin = 'Admin',
  Gallery = 'Gallery',
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
  ListFile_AwesomeNature = LocalPath.MasterDirName + '/awesomenature/list.json',
  ListFile_Tune = LocalPath.MasterDirName + '/tune/list.json',
  ListFile_Typo = LocalPath.MasterDirName + '/typo/list.json',
  ListFile_Info = LocalPath.MasterDirName + '/info/list.json',
  ListFile_Sunset = LocalPath.MasterDirName + '/sunset/list.json',
  ListFile_Vocabulary = LocalPath.MasterDirName + '/vocabulary/list.json',
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
  ListFile_Tune = 'tune/list.json',
  ListFile_AwesomeNature = 'awesomenature/list.json',
  ListFile_Info = 'info/list.json',
  ListFile_Typo = 'typo/list.json',
  ListFile_Sunset = 'sunset/list.json',
  ListFile_Vocabulary = 'vocabulary/list.json',
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
  Version_Tune = 'app/versions/tune',
  Version_Awesome = 'app/versions/awesome',
  Version_AwesomeNature = 'app/versions/awesomenature',
  Version_Vocabulary = 'app/versions/vocabulary',
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
  FunSound = 26,
  Tune = 27,
  Vocabulary = 28,
  AwesomeNature = 29,
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
  BookmarkOutline = 'bookmark-outline',
  Bookmark = 'bookmark',
  Upload = 'upload',
  Youtube = 'youtube',
  ShareImage = 'share-variant-outline',
  ThreeDots = 'dots-horizontal',
  NoInternet = 'access-point-network-off',
  HeartBroken = 'heart-broken',
  Lock = 'lock',
  Background = 'image-auto-adjust',
  Dice = 'dice-5-outline',
  Download = 'arrow-down',
  X = 'close-thick',
  Check = 'check-bold',
  List = 'format-list-bulleted-square',
  Right = 'chevron-right',
  MaxRight = 'chevron-double-right',
  Left = 'chevron-left',
  MaxLeft = 'chevron-double-left',
  Pin = 'pin',
  PinOutline = 'pin-outline',
  Link = 'link-variant',
  Eye = 'eye-outline',
  Star = 'star',
  Close = 'close',
  StarOutline = 'star-outline',
  Coffee = 'coffee',
  CheckBox_Yes = 'checkbox-marked-outline',
  CheckBox_No = 'checkbox-blank-outline',
  BellNewMsg = 'bell-badge',
  BellNoMsg = 'bell-outline',
  Gallery = 'view-dashboard',
  HeartFull = 'cards-heart',
  HeartOutline = 'cards-heart-outline',

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

export const shareAppText = `Gooday - Make your day good. A meme, information & positive stuffs app.

It's totally free. Download now!

AppStore: https://apps.apple.com/us/app/gooday-make-your-day/id6471367879

Google Play: https://play.google.com/store/apps/details?id=com.healyoursoul

#gooday #make_your_day_good`

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
  new: "New",
  share_app: "Share Gooday",
  share_app_2: "Share app",
  like: "Like",
  close: "Close",
  rate_app: "Rate app",
  Contact: "Contact",
  bg_for_white_text: "Backgrounds for white text",
  bg_for_black_text: "Backgrounds for black text",
  remove_background: "No background",
  background: "Background",
  saved_2: "Saved",
  upload: "Upload",
  cancel: "Cancel",
  lights_mode: "Light mode",
  lifetime: "Gooday Lifetime",
  lifetime_desc: "Buy once. Gooday limitless forever.",
  lifetime_desc_2: "Enjoy Gooday with an ad-free experience and\nunlock all features forever.",
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
  feedback_user_contact: "Please provide me with your email, or if you prefer, your contact information on WhatsApp, Twitter, Facebook, Instagram, etc. This will allow me to reach out to you if needed to address the issue. (Optional)",
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
  you_vip: 'You are VIP',
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
  saved: 'Downloaded!',
  setting: 'Setting',
  animation: 'Animation',
  rate_me: 'Rate app',
  save: 'Download',
  no_media_to_download: 'No media to download!',
  oops: 'Oooops',
  fact_of_the_day: 'Fact of the day',
  winners: 'Winners',
  fun_websites: 'Fun Websites',
  top_movies: 'Top 250 Movies',
  best_short_films: 'Best Short Films',
  filter: 'Filter',
  new_item_website: '# new fun website(s) added to the list',
  new_item_short_film: '# new short film(s) added to the list',
  new_item_top_movies: 'Latest data updated!',
  clear: 'Clear',
  clear_all: 'Clear all',
  mark_read: 'Mark as read',
  read_all: 'Mark as read all',
  seen_posts: 'Viewed posts',
  favorited_posts: 'Loved posts',

  one_time_purchase: 'You can choose between a one-time purchase',
  subscriptions: 'Or a subscription',
  subscribe: 'Subscribe',
  premium_benefit: 'Hi there, I am @onequy, an indie developer from Vietnam. I developed this app to spread fun, useful information, and positive things to everyone around the world. I am trying my best to keep the app free. However, I would be really happy and grateful if you subscribe and want to:',
  subscribe_for: 'Subscribe for',
  today: 'Today',
  warning_premium: 'These subscriptions are non-renewable. If you no longer wish to subscribe, it will be automatically canceled at the end of the period.',
  thank_you_premium: "Any purchase is greatly appreciated. Thank you 💛",

  you_have_no_item: "You have no item",
  diversity_empty_saved: "You have no item.\n\nSimply tap the Save icon on the header of the post you'd like to watch later, and it will be saved here for your convenience.",
  diversity_empty_gallery_loved: "You have no item.\n\nThe posts you loved will be displayed here.",
  diversity_empty_gallery_seen: "You have no item.\n\nAll the posts you've viewed will be displayed here.",
  limit_saved_desc: "In the free version, you can save up to ## posts. Upgrade to a subscription to enjoy unlimited savings.",
  limit_pages: "In the free version, you are limited to viewing items starting from page ##. Please subscribe to access all pages and explore the full range of items.",
  show_all: "Show all",
  full_saved: "Upgrade for Unlimited Saves",
  full_saved_desc: "You've reached the limit of ## items, which is the maximum quantity allowed in the free version. Please subscribe to save an unlimited number of items.",

  congrats_got_uploads: "Congrats! Your uploads are approved!",
  follow_rules_upload: "I have read and agree to abide by the rules and guidelines",
  read_rules: "Rules and guidelines",

  approved: 'Approved',
  rules: 'Rules',
  pick_image: 'Pick your image.',
  unsupport_file: 'Unsupport file',
  unsupport_file_desc: 'This file type is not supported currently. Please pick another file.',
  unsupport_video_for_premium: 'Video uploads are exclusive to subscribed users only. Please subscribe to enable uploading.',
  unsupport_filesize_over_limit: 'File size exceeds the limit!',
  uploading: "Uploading file...",
  update_info: "Updating info...",
  checking: "Checking...",
  can_not_get_app_config: "Can not get app config. Please check your internet.",
  can_not_get_user: "Can not get info. Please check your internet.",
  reached_limit_uploads: "You reached limit upload times.\nLimit per day: ##\nYou uploaded: @@\n\nPlease come back tomorrow, or subscribe to Gooday for unlimited uploads.",
  reached_limit_uploads_interval: "You can upload another one in ## minutes.",
  agree_rules: 'Please agree the rules and guidelines before uploading.',
  agree: 'Agree rules',
  banned_with_exp: "@@\n\nTime you can upload: ##",

  // ---------
  Upload_Guidelines: 'Upload Guidelines.',
  guidelines_desc: 'To ensure a positive and enjoyable experience for everyone, please adhere to the following rules when uploading memes:',

  Image_Content: 'Image Content:',
  Image_Content_desc: 'Only upload funny memes, wholesome, cute, or positive images.',

  Forbidden_Content: 'Forbidden Content:',
  Forbidden_Content_desc: 'Your images must NOT contain:',
  content_no: `1. Pornographic material
2. Violence or gory content,
3. Hate speech and bullying,
4. Spamming and manipulation,
5. Deceptive content,
6. Illegal activities,
7. Impersonation`,

  Failure_to_comply: 'Failure to comply with these rules may result in:',
  Failure_to_comply_desc: 'Temporary or permanent bans, depending on the severity of the violation. If banned, you can still use Gooday normally, but the upload feature will be disabled.',

  Other_Restrictions: 'Other Restrictions:',
  Other_Restrictions_desc: `1. Free users can upload a limited number of posts per day, currently set at @@ or maybe another number (adjusted by Gooday).
2. Subscribed users enjoy unlimited daily uploads.
3. Both free and subscribed users must adhere to a minimum posting interval of ## minutes/post. This interval may be subject to updates by Gooday.`,

  By_following_these: 'By following these guidelines, you contribute to making Gooday a fun and safe community for meme enthusiasts. Happy memeing!',

  // --------

  upgrade: 'Upgrade',
  refresh: 'Refresh',

  unlock_all: 'Unlock all features',

  unlock_all_info: `- Remove Ads
- Save an unlimited number of posts to watch later.
- Re-watch the posts you loved without any page limits in Gallery.
- Upload an unlimited number of memes.`,

  support_me: 'Support app',
  support_me_info: "- Support me in covering the monthly costs of the operation and data server.",

  give_coffee: 'Buy me a coffee',
  give_coffee_info: "- It will be great motivation for me to improve the app every day.",

  one_month: '1 Month',
  six_month: '6 Months',
  twelve_month: '12 Months',

  you_subscribed: 'You subscribed:',
  subscribed_date: 'Subscribed date:',
  subscribed_exp_date: 'Expired date:',
  day_left: 'Day(s) left:',

  thank_you_short: 'Thank you',

  thank_you: 'Your subscription means the world to me! It really makes my day. Thank you for supporting my app.',

  rate_in_app_5star_content: 'Thank you so much! Your support means a lot to me. Would you consider rating Gooday on the App Store as well? Your feedback can help the app reach a wider audience!',
  rate_in_app_text: 'Tap the star you want to rate Gooday',

  gooday_streak_1: 'First day of Gooday streak!',
  gooday_streak_2: 'You have a ##-Gooday streak in a row!',

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
  introduce_Satisfying: "Indulge in a collection of visually pleasing moments where every frame radiates eye-catching allure and aesthetic satisfaction. ✨",
  introduce_Tune: "Catchy melodies I extracted from songs that captivate the listener. 🎵",

  // popup

  popup_title_need_internet: 'No Internet',
  popup_content_need_internet: 'Please check your network and try again.',

  popup_title_error: 'Ooops!',
  popup_content_error: "Uh-oh! Something went wrong. We're fixing it. Thanks for your patience!",
  popup_content_error_empty: "The list is empty. Please pick at least 1 item!",
  popup_content_error_common: "Uh-oh! Something went wrong.",

  popup_content_sent_feedback: 'Thank you for taking the time to provide feedback! Your input is valuable and helps us improve.',
  popup_content_sent_feedback_error_hour: 'You just sent feedback recently. Please send another one at least in the next hour. Thank you!',

  upload_success: "Uploaded successfully",
  upload_success_desc: "Thank you for uploading to Gooday. I will try to review it as soon as possible. If it is approved, Gooday will notify you in the app. Stay tuned!",
  
  background_for_premium: "Gooday Premium",
  background_for_premium_content: "This background is available exclusively for Premium users. Upgrade now to unlock access to all backgrounds.",
}

// storage

export const StorageKey_AwardPictureLastSeenIdxOfYear = (year: number) => 'award_picture_last_seen_idx_' + year
export const StorageKey_ShowedIntroduceCat = (cat: Category) => 'introduce_' + cat
export const StorageKey_ItemCountCat = (cat: Category) => 'item_count_' + cat

export const StorageKey_LocalFileVersion = (cat: Category) => 'local_file_version_' + cat
export const StorageKey_LocalFileVersion_ShortText = 'local_file_version_short_text'

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
export const StorageKey_StreakLastTime = 'streak_last'
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
export const StorageKey_LastTickSendFeedback = 'feedback_tick'
export const StorageKey_PremiumBgID = 'premium_bg_ids'
export const StorageKey_UserID = 'user_id'
export const StorageKey_LastTickTrackLocation = 'tick_track_location'
export const StorageKey_LastTrackCountryName = 'tick_track_country'
export const StorageKey_DidRateInApp = 'did_rate_in_app'
export const StorageKey_CachedIAP = 'cached_iap'
export const StorageKey_CachedPressNextPost = 'cached_press_next_post'
export const StorageKey_CurPageFunSoundIdx = 'cur_page_idx_sound_fun'
export const StorageKey_ScreenToInit = 'categoryScreenToOpenFirst'
export const StorageKey_OpenAppTotalCount = 'open_app_total_count'
export const StorageKey_OpenAppOfDayCount = 'open_app_count'
export const StorageKey_LastFreshlyOpenApp = 'last_freshly_open_app'
export const StorageKey_OpenAppOfDayCountForDate = 'open_app_count_date'
export const StorageKey_IsUserPressedClosePleaseSubscribe = 'isUserPressedClosePleaseSubscribe'
export const StorageKey_MaxSavedCount = 'max_saved_count'
export const StorageKey_TodayUploadsCount = 'today_uploads_count'
export const StorageKey_LastTimeUpload = 'last_time_upload'
export const StorageKey_ReadRulesUpload = 'read_rules_upload'
export const StorageKey_HaveNewApprovedUploads = 'new_approved_uploads'
export const StorageKey_LastMiniIapProductIdxShowed = 'mini_iap_idx'
export const StorageKey_MiniIAPCount = 'mini_iap_count'
export const StorageKey_ClickNotificationOneSignal = 'click_onesignal'

// export const StorageKey_LastTickAskRate = 'last_ask_rate'
// export const StorageKey_LastAskRateIsPressRateOrNot = 'last_ask_rate_ok'