// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { postRequest } from '../services/AuthServices';
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
        try {
            const { confirmPassword, ...filteredData } = data
            console.log(filteredData);
            const response = postRequest('auth/signup', filteredData);
            response.then((res) => {
                if (res.status === 200 && res.data.success) {
                    alert('User registered successfully!');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],  // Reset the stack and navigate to Home
                    });
                } else {
                    alert('Registration failed. Please try again.');
                }
            })

        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* <Button title="Sign Up" onPress={handleSubmit(onSubmit)} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
