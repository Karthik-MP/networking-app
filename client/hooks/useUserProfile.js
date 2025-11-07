import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { computeProfileCompletion } from "../services/profileCompletion";
import { uploadAvatar as storageUploadAvatar } from "../services/storage";
import { showToast } from "../components/toast";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  // console.log("user from AuthContext", user)

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!mounted) return;
        const data = snap.exists() ? snap.data() : {};
        const base = data || {
          full_name: { first_name: "", last_name: "" },
          email_address: user.email || "",
          phone_number: { country_code: "+1", number: "" },
          native_location: { country: "", state: "", city: "", zip: "" },
          immigrant: { is_immigrant: false, foreign_residence: { country: "", state: "", city: "", zip: "" } },
          education: [],
          experience: [],
          interests: { industries: [], it_sub: [], hobbies: [] },
          photoURL: data.photoURL || "",
          ...data
        };
        // console.log(base)
        setProfile(base);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // }, []);?
  }, [user]);

  const completion = useMemo(() => computeProfileCompletion(profile), [profile]);

  const saveProfile = async (partial) => {
    console.log("Save Profile...")
    if (!user) return;
    setSaving(true);
    try {
      const next = { ...profile, ...(partial || {}) };
      const payload = { ...next, completeness: computeProfileCompletion(next) };
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...payload,
          photoURL: payload.photoURL || "",
          updatedAt: serverTimestamp(),
          profileCompleted: !!payload.photoURL && payload.completeness === 100,
        },
        { merge: true }
      );
      setProfile(payload); // <--- this updates globally
      showToast("success", "Saved Profile");
      return payload;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (localUri) => {
    if (!user) return;
    const downloadURL = await storageUploadAvatar(user.uid, localUri);
    await saveProfile({ photoURL: downloadURL });
    return downloadURL;
  };

  return (
    <UserProfileContext.Provider
      value={{ user, profile, setProfile, loading, saving, completion, saveProfile, uploadAvatar }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
