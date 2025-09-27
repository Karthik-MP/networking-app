import { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    FlatList,
    Switch,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase"; // <-- adjust if your path differs
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import LocationPicker from "../components/Location/LocationPicker"; // <- new reusable component
import { SafeAreaView } from "react-native-safe-area-context";
// If you use your toaster: replace these with your actual toaster calls
const Toast = { success: (m) => console.log(m), error: (m) => console.log(m) };

const PHONE_CODES = [
    { id: "+1", label: "+1 (US/CA)" },
    { id: "+91", label: "+91 (IN)" },
    { id: "+44", label: "+44 (UK)" },
];

function Dropdown({ label, items, value, onSelect, placeholder = "Select...", disabled }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const selectedLabel = useMemo(
        () => items.find((i) => i.id === value)?.label || "",
        [items, value]
    );
    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return items.filter((i) => i.label.toLowerCase().includes(qq));
    }, [q, items]);

    return (
        <View style={{ marginBottom: 12 }}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TouchableOpacity
                disabled={disabled}
                style={[styles.input, disabled && { backgroundColor: "#f3f4f6" }]}
                onPress={() => setOpen(true)}
            >
                <Text style={{ color: selectedLabel ? "#111827" : "#9ca3af" }}>
                    {selectedLabel || placeholder}
                </Text>
            </TouchableOpacity>

            <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label || "Select"}</Text>
                        <TouchableOpacity onPress={() => setOpen(false)}>
                            <Text style={styles.link}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <TextInput
                            placeholder="Search..."
                            value={q}
                            onChangeText={setQ}
                            style={styles.input}
                        />
                    </View>

                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelect(item.id);
                                    setOpen(false);
                                    setQ("");
                                }}
                                style={styles.optionRow}
                            >
                                <Text style={{ color: "#111827" }}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </View>
            </Modal>
        </View>
    );
}

export default function SignupScreen({ navigation }) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            // Basics
            first_name: "",
            last_name: "",
            email_address: "",
            password: "",
            confirmPassword: "",
            // Phone
            phone_country_code: "+1",
            phone_number: "",
            // Location
            native_location: { country: "", state: "", city: "", zip: "" },
            // Immigrant
            is_immigrant: false,
            foreign_residence: { country: "", state: "", city: "", zip: "" },
        },
    });

    const password = watch("password");
    const isImmigrant = watch("is_immigrant");

    const onSubmit = async (data) => {
        try {
            const {
                email_address,
                password,
                first_name,
                last_name,
                phone_country_code,
                phone_number,
                native_location,
                is_immigrant,
                foreign_residence,
            } = data;

            const userCredential = await createUserWithEmailAndPassword(auth, email_address, password);
            const user = userCredential.user;

            const payload = {
                uid: user.uid,
                email_address,
                full_name: { first_name, last_name },
                phone_number: { country_code: phone_country_code, number: phone_number },
                // RENAMED: native_location object
                native_location, // { country, state, city, zip }
                immigrant: is_immigrant
                    ? {
                        is_immigrant: true,
                        // UPDATED: object not string
                        foreign_residence, // { country, state, city, zip }
                    }
                    : { is_immigrant: false },
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", user.uid), payload, { merge: true });

            Toast.success("Signed up successfully!");
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (e) {
            console.error(e);
            Toast.error("Error during signup. Please try again.");
        }
    };


    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.root}>
                <View>
                    <Text style={styles.header}>Create your account</Text>
                    <Text style={styles.subheader}>
                        Let’s start with a few basics. You can complete the rest of your profile later.
                    </Text>

                    {/* Full Name */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Full name</Text>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Controller
                                    control={control}
                                    name="first_name"
                                    rules={{ required: "First name is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="First name"
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}
                                        />
                                    )}
                                />
                                {errors.first_name && (
                                    <Text style={styles.error}>{errors.first_name.message}</Text>
                                )}
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Controller
                                    control={control}
                                    name="last_name"
                                    rules={{ required: "Last name is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Last name"
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}
                                        />
                                    )}
                                />
                                {errors.last_name && (
                                    <Text style={styles.error}>{errors.last_name.message}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Email & Password */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account</Text>

                        <Controller
                            control={control}
                            name="email_address"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    placeholder="Email address"
                                    value={value}
                                    onChangeText={onChange}
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                        {errors.email_address && (
                            <Text style={styles.error}>{errors.email_address.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: "Password is required",
                                minLength: { value: 6, message: "At least 6 characters" },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    placeholder="Password"
                                    value={value}
                                    onChangeText={onChange}
                                    style={styles.input}
                                    secureTextEntry
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.error}>{errors.password.message}</Text>
                        )}

                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: "Please confirm your password",
                                validate: (v) => v === password || "Passwords do not match",
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    placeholder="Confirm password"
                                    value={value}
                                    onChangeText={onChange}
                                    style={styles.input}
                                    secureTextEntry
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
                        )}
                    </View>

                    {/* Phone */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Phone</Text>
                        <View style={styles.row}>
                            <View style={{ width: 140, marginRight: 8 }}>
                                <Controller
                                    control={control}
                                    name="phone_country_code"
                                    render={({ field: { value } }) => (
                                        <Dropdown
                                            label="Code"
                                            items={PHONE_CODES}
                                            value={value}
                                            onSelect={(v) => setValue("phone_country_code", v)}
                                        />
                                    )}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Controller
                                    control={control}
                                    name="phone_number"
                                    rules={{
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{6,15}$/,
                                            message: "Use digits only (6–15)",
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Phone number"
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.input}
                                            keyboardType="phone-pad"
                                        />
                                    )}
                                />
                                {errors.phone_number && (
                                    <Text style={styles.error}>{errors.phone_number.message}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Location */}
                    {/* Native location (replaces old country/state/city/zip inputs) */}
                    <LocationPicker
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        namePrefix="native_location"
                        label="Native Location"
                    />

                    {/* Immigrant Toggle */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Immigration</Text>
                        <View style={styles.toggleRow}>
                            <Text style={{ color: "#111827" }}>Are you an immigrant?</Text>
                            <Controller
                                control={control}
                                name="is_immigrant"
                                render={({ field: { value, onChange } }) => (
                                    <Switch value={value} onValueChange={onChange} />
                                )}
                            />
                        </View>

                        {isImmigrant && (
                            <>
                                {/* NEW: foreign_residence as object {country,state,city,zip} */}
                                <LocationPicker
                                    control={control}
                                    setValue={setValue}
                                    watch={watch}
                                    namePrefix="foreign_residence"
                                    label="Foreign Country of Residence"
                                />
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.buttonText}>{isSubmitting ? "Please wait…" : "Sign Up"}</Text>
                    </TouchableOpacity>

                    <Text style={styles.smallNote}>
                        By signing up you agree to our Terms and Privacy Policy.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        padding: 20,
        backgroundColor: "#f5f7fb",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },
    subheader: {
        marginTop: 6,
        color: "#6b7280",
        marginBottom: 14,
    },
    section: {
        marginTop: 12,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    label: {
        color: "#374151",
        marginBottom: 6,
        fontWeight: "500",
    },
    error: {
        color: "#ef4444",
        marginTop: -6,
        marginBottom: 8,
        fontSize: 12,
    },
    button: {
        marginTop: 8,
        height: 52,
        backgroundColor: "#2563eb",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    smallNote: {
        textAlign: "center",
        marginTop: 10,
        color: "#9ca3af",
        fontSize: 12,
    },
    modalHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    link: { color: "#2563eb", fontWeight: "600" },
    optionRow: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "white" },
    separator: { height: 1, backgroundColor: "#f3f4f6" },
    toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
        marginBottom: 4,
    },
});
