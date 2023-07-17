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