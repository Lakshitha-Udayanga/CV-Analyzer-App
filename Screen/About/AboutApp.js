import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from '../styles/AboutStyles';


export default function AboutApp({userData, setActiveScreen, onLogout}) {
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

  const goToUserProfile = () => {
    Alert.alert('User Profile', 'Profile screen coming soon...', [
      {
        text: 'OK',
        onPress: () => setActiveScreen('UserProfile'), 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>About Application</Text>
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
        <Image
          source={require('../../assets/images/lakshitha.jpg')}
          style={styles.avatar}
        />

        <Text style={styles.name}>Lakshitha Udayanga</Text>
        <Text style={styles.email}>lakshithamaludayanga19@gmail.com</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.sectionContent}>
            A passionate mobile app developer with experience in React Native,
            backend APIs, and cross-platform development. Always learning and
            building.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App About</Text>
          <Text style={styles.sectionContent}>
           Built with React Native, Laravel, MySQL, and Python, this AI-powered app analyzes CVs and recommends the best job opportunities for Sri Lankan job seekers.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

