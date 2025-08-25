import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  Button,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';

export default function Home({userData, setActiveScreen, onLogout}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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

  // Pick File Function
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      setFile(res[0]); // store first selected file
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Could not select file.');
      }
    }
  };

  // Upload & Analyze File
  const uploadFile = async () => {
    if (!file) {
      Alert.alert('Error', 'Please select a resume first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      // Replace with your backend API endpoint
      const response = await fetch(
        'https://your-backend-url.com/api/analyze-resume',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload & analyze resume.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Resume Analyzer</Text>
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

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome {userData.name} 👋</Text>

        <SafeAreaView style={{width: '100%', padding: 20}}>
          <Button title="Select Resume (PDF/DOC)" onPress={pickFile} />

          {file && (
            <View style={{marginVertical: 10}}>
              <Text>Selected File: {file.name}</Text>
            </View>
          )}

          <View style={styles.spacer}>
            <Button
              title="Upload & Analyze"
              onPress={uploadFile}
              disabled={loading}
            />
          </View>
          {loading && (
            <ActivityIndicator size="large" style={{marginTop: 20}} />
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <View style={{marginTop: 20}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Summary:</Text>
              <Text>{analysisResult.summary_text}</Text>

              <Text style={{fontWeight: 'bold', marginTop: 15}}>
                Strengths:
              </Text>
              {analysisResult.strengths?.map((s, idx) => (
                <Text key={idx}>• {s.description}</Text>
              ))}

              <Text style={{fontWeight: 'bold', marginTop: 15}}>
                Weaknesses:
              </Text>
              {analysisResult.weaknesses?.map((w, idx) => (
                <Text key={idx}>• {w.description}</Text>
              ))}

              <Text style={{fontWeight: 'bold', marginTop: 15}}>
                Job Recommendations:
              </Text>
              {analysisResult.job_recommendations?.map((job, idx) => (
                <View key={idx} style={{marginBottom: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{job.job_title}</Text>
                  <Text>{job.job_description}</Text>
                </View>
              ))}
            </View>
          )}
        </SafeAreaView>
      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>Resume Analyzer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  navBar: {
    height: 60,
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  navTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  navRight: {flexDirection: 'row', alignItems: 'center'},
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
  logoutText: {color: '#fff', fontWeight: 'bold'},
  content: {padding: 20, alignItems: 'center'},
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  spacer: {marginVertical: 10},
  bottomNav: {
    height: 60,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  downnavTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
});
