import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  useColorScheme,
  ActivityIndicator,
  Image,
} from 'react-native';

const LoginScreen = ({onLoginSuccess, onRegister}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Error', 'Username and Password are required');
      setLoading(false);
      return;
    }

    const baseUrl = 'https://cicvaccinecenter.sltech.lk';

    try {
      const urlEndPoint = `${baseUrl}/api/login?username=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(urlEndPoint, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });

      const data = await response.json();

      if (data.username && data.username.trim() !== '') {
        Alert.alert('Login Successful', `Welcome, ${data.username || 'User'}`);
        onLoginSuccess(data);
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
    setLoading(false);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000' : '#fff'},
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Image
        source={{
          uri: 'https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png',
        }}
        style={styles.logo}
      />
      <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
        Login
      </Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#888"
        style={[styles.input, {color: isDarkMode ? '#fff' : '#000'}]}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={[styles.input, {color: isDarkMode ? '#fff' : '#000'}]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={{gap: 10}}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && styles.disabledButton]}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onRegister} style={styles.button}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', paddingHorizontal: 24},
  title: {fontSize: 32, marginBottom: 30, alignSelf: 'center'},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 25,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {color: '#fff', fontSize: 18},
  registerButtonText: {color: '#fff', fontSize: 18},
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
});
