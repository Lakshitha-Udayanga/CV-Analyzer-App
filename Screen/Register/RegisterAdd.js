import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

export default function RegisterAdd({setActiveScreen}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginScreen = () => {
    setActiveScreen('Login');
  };

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !passwordConfirmation
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://resumeanalyzer.sltech.lk/api/user/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
          }),
        },
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const user = data.user;
        setUserData(user);
        Alert.alert('Success', 'Registration successful!');
        setActiveScreen('Login');

        // Reset form
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        if (data.errors) {
          var messages = Object.values(data.errors).flat().join('\n');
          Alert.alert('Validation Error', messages);
        } else {
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={handleLoginScreen}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#b1adadff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 22,
    marginBottom: 4,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
});
