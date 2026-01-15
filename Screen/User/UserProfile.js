import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';

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
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={deleteAccount}>
          <Text style={styles.logoutText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={deleteAccount}>
          <Text style={styles.editText}>Edit Account</Text>
        </TouchableOpacity>

        <Text style={styles.sectionContent}></Text>
        {/* </View> */}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveScreen('AboutApp')}>
          <Text style={styles.downnavTitle}>About App</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  pdf: {
    flex: 1,
  },

  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },

  navBar: {
    height: 60,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  navTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  downnavTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  editButton: {
    backgroundColor: '#1d5dbd',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 95,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
  },

  bottomNav: {
    height: 60,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
