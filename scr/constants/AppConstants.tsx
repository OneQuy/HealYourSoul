import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

// screen names

export enum ScreenName {
  MediaWithCopyright = 'Media Copyright',
  RealMedia = 'Real Media',
}

// margin / padding

export enum  Outline {
  Horizontal = wp('4%'),
  GapVertical = hp('1%'),
}

// size

export enum  Size {
  WP100 = wp('100%'),
}

// font size

export enum FontSize {
  Big = wp('7%'),
  Normal = wp('5%'),
}

// dir / file

export enum LocalPath {
  MasterDirName = 'master_dir',
  ListFile_Draw = LocalPath.MasterDirName + '/draw/list.json',
  ListFile_Real = LocalPath.MasterDirName + '/real/list.json',
  ListFile_Quote = LocalPath.MasterDirName + '/quote/list.json'
}

export enum FirebasePath {
  ListFile_Draw = 'draw/list.json',
  ListFile_Real = 'real/list.json',
  ListFile_Quote = 'quote/list.json',
}

export enum FirebaseDBPath {
  Version_Draw = 'app/versions/draw',
  Version_Real = 'app/versions/real',
  Version_Quote = 'app/versions/quote'
}

// category

export enum Category {
  Draw = 0,
  Real = 1,
  Quote = 2
}