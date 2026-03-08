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
  Linking,
} from 'react-native';
import styles from '../styles/UserProfileStyles';


export default function Home({userData, setActiveScreen, onLogout}) {
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

  const deleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${userData.baseUrl}/api/delete/user/${userData.id}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userData.token}`,
                    Accept: 'application/json',
                  },
                },
              );

              if (response.ok) {
                Alert.alert('Success', 'Account deleted successfully.');
                onLogout();
              } else {
                const errorData = await response.json();
                Alert.alert(
                  'Error',
                  errorData.message || 'Failed to delete account.',
                );
              }
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ],
    );
  };

  const goToUserProfile = () => {
    Alert.alert('User Profile', 'Profile screen coming soon...', [
      {
        text: 'OK',
        onPress: () => setActiveScreen('UserProfile'),
      },
    ]);
  };

  const cvList = userData?.cv_lists ?? [];

  const baseUrl = 'https://cvanalyzer.sltech.lk';

  const openCV = async path => {
    if (!path) {
      Alert.alert('Invalid URL');
      return;
    }

    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log(error);
      Alert.alert('Cannot open file');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Profile</Text>
        <View style={styles.navRight}>
          {/* Profile Image */}
          <Pressable onPress={goToUserProfile}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.profileImage}
            />
          </Pressable>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{uri: 'https://i.pravatar.cc/300?img=12'}}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Name</Text>
          <Text style={styles.sectionContent}>{userData.name}</Text>
          <Text style={styles.sectionTitle}>E-Mail</Text>
          <Text style={styles.sectionContent}>{userData.email}</Text>
          <Text style={styles.sectionTitle}>Mobile Number</Text>
          <Text style={styles.sectionContent}>{userData.phone}</Text>
          <Text style={styles.sectionTitle}>Register No</Text>
          <Text style={styles.sectionContent}>{userData.user_ref_no}</Text>
          <Text style={styles.sectionTitle}>Register Date</Text>
          <Text style={styles.sectionContent}>
            {new Date(userData.created_at).toLocaleString()}
          </Text>
          <Text style={styles.sectionTitle}></Text>

          <ScrollView style={styles.cvContainer}>
            <Text style={styles.cvSectionTitle}>
              =================== Uploaded CV List =====================
            </Text>

            {cvList.length > 0 ? (
              cvList.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  onPress={() => openCV(item.file_path)}
                  style={{marginBottom: 10}}>
                  <Text style={styles.linkText}>View CV {index + 1}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No CVs Available</Text>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={deleteAccount}>
          <Text style={styles.logoutText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setActiveScreen('EditAccount')}>
          <Text style={styles.editText}>Edit Account</Text>
        </TouchableOpacity>

        <Text style={styles.sectionContent}></Text>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveScreen('AboutApp')}>
          <Text style={styles.downnavTitle}>About App</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}


