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
import { useContext } from "react";
import { View } from "react-native";

export default function ProfileScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { loading, completion } = useUserProfile();
  if (loading) return <Loading size="46" />;
  return (
    <ScreenScroll className="mx-6 mt-5">
      <ProfileHeader/>
      {/* {completion != 100 && <Button title="Complete Profile" type="primary" onPressFunction={() => navigation.navigate("CompleteProfile")} />} */}
      <View style={{ height: 12 }} />
      <PersonalSection />
      <EducationSection />
      <ExperienceSection />
      <InterestsSection />
      <View style={{ height: 24 }} />
      <Button title="Sign out" type="secondary" onPressFunction={logout} />
    </ScreenScroll>
  );
}
