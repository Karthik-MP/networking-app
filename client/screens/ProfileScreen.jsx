// client/screens/ProfileScreen.js
import Button from "@components/Button";
import { ScreenScroll } from "@components/layout/Screen";
import Loading from "@components/Loading/Loading";
import EducationSection from "@components/profile/EducationSection";
import ExperienceSection from "@components/profile/ExperienceSection";
import InterestsSection from "@components/profile/InterestsSection";
import PersonalSection from "@components/profile/PersonalSection";
import ProfileHeader from "@components/profile/ProfileHeader";
import AuthContext from "@contexts/AuthContext";
import { useUserProfile } from "@hooks/useUserProfile";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { showToast } from "../components/toast";
import { useTheme } from "../hooks/useTheme";
import {
  addConnections,
  removeConnection,
} from "../services/connectionServices";
import { getUserProfile } from "../services/userProfile";
export default function ProfileScreen({ route }) {
  const { backgroundColor } = useTheme();
  const { logout, user } = useContext(AuthContext);
  const { loading, currentUserConnections } = useUserProfile();
  const [profileData, setProfileData] = useState();
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connect");

  // Get userId from route params (profileUser.uid), or use current user's uid
  const userId = route?.params?.profileUser?.uid || user?.uid;
  // If no profileUser in params, or if it matches current user, then it's current user
  const isCurrentUser =
    !route?.params?.profileUser?.uid ||
    route?.params?.profileUser?.uid === user?.uid;

  useEffect(() => {
    // Only fetch if viewing another user's profile
    if (!isCurrentUser && userId) {
      const fetchProfile = async () => {
        setFetchingProfile(true);
        try {
          const data = await getUserProfile({ profileUser: { uid: userId } });
          // console.log("Profile data fetched:", data);
          setProfileData(data);
        } catch (error) {
          console.error("Error loading profile:", error);
        } finally {
          setFetchingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [userId, isCurrentUser]);

  // Update connection status based on current connections
  useEffect(() => {
    if (!profileData?.uid || !currentUserConnections) return;

    if (currentUserConnections?.follower_id?.includes(profileData?.uid)) {
      setConnectionStatus("Connected");
    } else if (
      currentUserConnections?.requested_followers_id?.includes(profileData?.uid)
    ) {
      setConnectionStatus("Withdraw");
    } else {
      setConnectionStatus("Connect");
    }
  }, [currentUserConnections, profileData?.uid]);

  const onConnect = async () => {
    try {
      if (connectionStatus === "Withdraw") {
        // Remove connection request
        await removeConnection(user?.uid, profileData?.uid);
        setConnectionStatus("Connect"); // Update status immediately
        showToast("success", "Connection request cancelled");
        console.log(`Connection request cancelled`);
      } else {
        // Add connection request
        await addConnections(user?.uid, profileData?.uid);
        setConnectionStatus("Withdraw"); // Update status immediately
        showToast("success", "Connection request sent");
        console.log(`Connection successfully added`);
      }
    } catch (error) {
      showToast("error", "Try again later!");
      console.error("Error:", error);
    }
  };

  if (loading || fetchingProfile) return <Loading size="46" />;
  return (
    <ScreenScroll className="mx-6">
      <ProfileHeader profileData={profileData} isCurrentUser={isCurrentUser} />
      {/* {completion != 100 && <Button title="Complete Profile" type="primary" onPressFunction={() => navigation.navigate("CompleteProfile")} />} */}
      {!isCurrentUser && (
        <View className="flex-1 justify-center items-center">
          <Pressable
            onPress={onConnect}
            className={`rounded-2xl py-4 w-36 items-center mb-4 ${connectionStatus === "Connect" ? backgroundColor?.buttonPrimary : backgroundColor?.buttonDanger}`}
          >
            {/* Button text is always white to match violet pill in mock */}
            <Text className="text-base font-bold text-white">
              {connectionStatus}
            </Text>
          </Pressable>
        </View>
      )}
      <PersonalSection
        profileData={profileData}
        isCurrentUser={isCurrentUser}
      />
      {(isCurrentUser || profileData?.education?.length > 0) && (
        <EducationSection
          profileData={profileData}
          isCurrentUser={isCurrentUser}
        />
      )}
      {(isCurrentUser || profileData?.experience?.length > 0) && (
        <ExperienceSection
          profileData={profileData}
          isCurrentUser={isCurrentUser}
        />
      )}

      <InterestsSection
        profileData={profileData}
        isCurrentUser={isCurrentUser}
      />

      {isCurrentUser && (
        <Button
          title="Sign out"
          type={backgroundColor?.buttonDanger}
          onPressFunction={logout}
        />
      )}
    </ScreenScroll>
  );
}
