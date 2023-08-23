import { PermissionsAndroid, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

/**
 * 
 * @returns null if success, otherwise error
 */
export async function SaveToGalleryAsync(flp: string) {
  try {
    if (Platform.OS === 'android') {
      await checkAndroidPermission();
    }

    // CameraRoll.save(flp, { type, album })
    await CameraRoll.save(flp)
    return null;
  }
  catch (error) {
    return error;
  }
};

const checkAndroidPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
}