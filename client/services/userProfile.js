import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserProfile({ profileUser: user }) {
    try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            const defaultProfileData = {
                full_name: { first_name: "", last_name: "" },
                email_address: user.email || "",
                phone_number: { country_code: "+1", number: "" },
                native_location: { country: "", state: "", city: "", zip: "" },
                immigrant: { is_immigrant: false, foreign_residence: { country: "", state: "", city: "", zip: "" } },
                education: [],
                experience: [],
                interests: { industries: [], it_sub: [], hobbies: [] },
                photoURL: "",
            };
            return defaultProfileData;
        }

        const data = snap.data();

        const profileData = {
            full_name: data.full_name || { first_name: "", last_name: "" },
            email_address: data.email_address || user.email || "",
            phone_number: data.phone_number || { country_code: "+1", number: "" },
            native_location: data.native_location || { country: "", state: "", city: "", zip: "" },
            immigrant: data.immigrant || { is_immigrant: false, foreign_residence: { country: "", state: "", city: "", zip: "" } },
            education: data.education || [],
            experience: data.experience || [],
            interests: data.interests || { industries: [], it_sub: [], hobbies: [] },
            photoURL: data.photoURL || "",
            ...data,
        };

        return profileData;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}