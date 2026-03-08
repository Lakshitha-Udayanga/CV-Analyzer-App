import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/ForgetPasswordStyles';


export default function ForgotPassword({userData, setActiveScreen}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      const baseUrl = 'https://cvanalyzer.sltech.lk';
      const token =
        'OI5qFHMkPPALwWVTWWiXUbHD1xNxE1N5QwFnkJV3aLe1Nd3TtG3IuOQ2d6VDkQfQZAABlZfFJggxHUms';
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({email}),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          'A password reset link has been sent to your email.',
          [{text: 'OK', onPress: () => setActiveScreen('Login')}],
        );
      } else {
        Alert.alert('Error', data.message || 'Email not found.');
      }
    } catch (err) {
      console.log('Forgot password error:', err);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a temporary password. (Valid for 15 minutes only)
      </Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleReset}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.resetText}>Send Reset</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => setActiveScreen('Login')}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

