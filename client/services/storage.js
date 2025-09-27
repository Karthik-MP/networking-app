// client/services/storage.js
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";
import { storage } from "./firebase";

/**
 * Compress & upload avatar to: users/{uid}/avatar.jpg
 * @param {string} uid
 * @param {string} localUri - e.g., from ImagePicker
 */
export async function uploadAvatar(uid, localUri) {
  console.log("Uploading avatar for", uid, localUri);
  // 1) compress (target ~720px long edge, JPEG 0.7)
  const manipulated = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 720 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  console.log("Manupulated image", manipulated);
  // 2) fetch -> blob
  const res = await fetch(manipulated.uri);
  const blob = await res.blob();

  // 3) upload
  const path = `users/${uid}/avatar.jpg`;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: "image/jpeg" });

  await new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      // (snap) => console.log("upload progress", snap.bytesTransferred),
      () => {},
      reject,
      resolve
    );
  });

  // 4) get public URL
  const downloadURL = await getDownloadURL(storageRef);
  console.log("Avatar available at", downloadURL);
  return downloadURL;
}
