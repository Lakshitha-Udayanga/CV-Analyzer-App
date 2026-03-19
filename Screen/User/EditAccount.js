import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

import styles from '../styles/UserEditStyles';

export default function EditAccount({userData, setActiveScreen, onLogout}) {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const bodyData = {
        name,
        email,
        phone,
      };

      if (password) {
        bodyData.password = password;
        bodyData.password_confirmation = confirmPassword;
      }

      const response = await fetch(
        `${userData.baseUrl}/api/update/user/${userData.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify(bodyData),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Update failed.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.status || errorData.message || errorMessage;
        } catch (e) {}
        Alert.alert('Error', errorMessage);
        return;
      }

      const responseText = await response.text();
      if (!responseText) {
        Alert.alert('Error', 'Empty response from server.');
        return;
      }

      const data = JSON.parse(responseText);
      Alert.alert('Response', JSON.stringify(data));

      if (response.ok) {
        Alert.alert('Success', data.status || 'Profile updated successfully');
        setActiveScreen('Home');
      } else {
        Alert.alert('Error', data.status || 'Update failed');
      }
    } catch (error) {
      console.log('Update Error:', error);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    }
  };

  const goToUserProfile = () => {
    Alert.alert('User Profile', 'Profile screen coming soon...', [
      {
        text: 'OK',
        onPress: () => setActiveScreen('UserProfile'),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          onLogout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Profile Edit</Text>
        <View style={styles.navRight}>
          <Pressable onPress={goToUserProfile}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.profileImage}
            />
          </Pressable>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Account</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Leave blank to keep current password"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Re-enter new password"
          />

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setActiveScreen('UserProfile')}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
