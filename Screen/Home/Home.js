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
  const [extractedText, setExtractedText] = useState('');

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

  const handlePDF = async () => {
    if (!file) return Alert.alert('Select a file first');
    const text = await extractTextFromPDF(file);
    setExtractedText(text);
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
      formData.append('pdf', {
        uri: file.uri,
        type: file.mimeType || file.type || 'application/pdf',
        name: file.name,
      });

      const response = await fetch(
        `${userData.baseUrl}/api/resume/upload/${userData.id}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
          },
        },
      );

      const data = await response.json();
      Alert.alert('Response', JSON.stringify(data));

      setAnalysisResult(data.parsed_data); // ✅ SAVE RESPONSE
      setLoading(false);

      // const result = await response.json();
      // setAnalysisResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload & analyze resume.');
    }
    setLoading(false);
  };

  const renderList = (title, items, color) => (
    <View style={[styles.card, {borderTopColor: color}]}>
      <Text style={[styles.cardTitle, {color}]}>{title}</Text>

      {items && items.length > 0 ? (
        items.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No {title.toLowerCase()} detected.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>CV Analyzer</Text>
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
            <>
              {/* Summary */}
              <View style={[styles.card, {borderTopColor: '#2f80ed'}]}>
                <Text style={[styles.cardTitle, {color: '#2f80ed'}]}>
                  Professional Summary
                </Text>
                <Text style={styles.summaryText}>{analysisResult.summary}</Text>
              </View>

              {/* Strengths */}
              {renderList('Strengths', analysisResult.strengths, '#27ae60')}

              {/* Skills */}
              {renderList('Technical Skills', analysisResult.technical_skills, '#2d9cdb')}

              {renderList('Soft Skills', analysisResult.soft_skills, '#db812d')}

              {/* Certificates */}
              {renderList(
                'Certificates',
                analysisResult.certificates,
                '#f2c94c',
              )}

               {/* Weaknesses */}
              {renderList('Weaknesses', analysisResult.weaknesses, '#eb5757')}
            </>
          )}

          <View style={styles.spacer}>
            <Button
              title="RECOMMENDATIONS JOBS"
              onPress={handlePDF}
              disabled={loading}
            />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
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

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },

  listItem: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
