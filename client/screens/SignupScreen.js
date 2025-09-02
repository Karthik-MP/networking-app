// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
// import { auth } from '../services/firebase';

export default function SignupScreen({ navigation }) {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        const { email, password, locationUSA, locationIndia } = data;

        try {
            // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;

            // // Save extra user data in Firestore
            // await setDoc(doc(db, 'users', user.uid), {
            //     uid: user.uid,
            //     email,
            //     locationUSA,
            //     locationIndia,
            //     createdAt: serverTimestamp(),
            // });

            // Optional: navigate to home screen or show success message
            // navigation.replace('Home');
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <View style={styles.container}>

            {/* Email Field */}
            <Controller
                control={control}
                name="email"
                rules={{ required: 'Email is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            {/* Password Field */}
            <Controller
                control={control}
                name="password"
                rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
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
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            {/* Confirm Password Field */}
            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Confirm Password"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        secureTextEntry
                    />
                )}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

            {/* Location in USA */}
            <Controller
                control={control}
                name="locationUSA"
                rules={{ required: 'USA location is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Location in USA"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                    />
                )}
            />
            {errors.locationUSA && <Text style={styles.error}>{errors.locationUSA.message}</Text>}

            {/* Location in India */}
            <Controller
                control={control}
                name="locationIndia"
                rules={{ required: 'India location is required' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Location in India"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                    />
                )}
            />
            {errors.locationIndia && <Text style={styles.error}>{errors.locationIndia.message}</Text>}

            <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
