// client/screens/ProfileScreen.js
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useUserProfile } from "../hooks/useUserProfile";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalSection from "../components/profile/PersonalSection";
import EducationSection from "../components/profile/EducationSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import InterestsSection from "../components/profile/InterestsSection";
import Button from "../components/Button";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }) {
    const { logout } = useContext(AuthContext);
    const { loading, completion } = useUserProfile();
    if (loading) return <ActivityIndicator />;
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <ProfileHeader />
                {/* {completion != 100 && <Button title="Complete Profile" type="primary" onPressFunction={() => navigation.navigate("CompleteProfile")} />} */}
                <View style={{ height: 12 }} />
                <PersonalSection />
                <EducationSection />
                <ExperienceSection />
                <InterestsSection />
                <View style={{ height: 24 }} />
                <Button title="Sign out" type="secondary" onPressFunction={logout} />
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({ container: { padding: 16, paddingTop: 28 } });
