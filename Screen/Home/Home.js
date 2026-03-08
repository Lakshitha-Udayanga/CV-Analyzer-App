import {
  View,
  Text,
  TouchableOpacity,
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
import styles from '../styles/HomeStyles';

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
      Alert.alert('Error', 'Please select a cv first.');
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
      // Alert.alert('Response', JSON.stringify(data));
      Alert.alert('Login Successful', `CV Uploaded and analyzed successfully.`);

      setAnalysisResult(data.parsed_data);
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
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>CV Analyzer</Text>
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome {userData.name} 👋</Text>

        <SafeAreaView style={{width: '100%', padding: 20}}>
          <Button title="Select CV (PDF/DOC)" onPress={pickFile} />

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

          {analysisResult && (
            <>
              <View style={[styles.card, {borderTopColor: '#2f80ed'}]}>
                <Text style={[styles.cardTitle, {color: '#2f80ed'}]}>
                  Professional Summary
                </Text>
                <Text style={styles.summaryText}>{analysisResult.summary}</Text>
              </View>

              {renderList('Strengths', analysisResult.strengths, '#27ae60')}

              {renderList(
                'Technical Skills',
                analysisResult.technical_skills,
                '#2d9cdb',
              )}

              {renderList('Soft Skills', analysisResult.soft_skills, '#db812d')}

              {renderList(
                'Certificates',
                analysisResult.certificates,
                '#f2c94c',
              )}

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

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
