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

// import RNFS from 'react-native-fs';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

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

  const extractTextFromPDF = async file => {
    try {
      // const base64Data = await RNFS.readFile(file.uri, 'base64');
      // Alert.alert('Debug', JSON.stringify(base64Data, null, 2));
      let filePath = file.uri;
      Alert.alert('Debug', base64Data.substring(0, 100) + '...');
      // Convert content:// to actual file path
      if (filePath.startsWith('content://')) {
        const stat = await RNFS.stat(file.uri);
        filePath = stat.path;
      }
      const base64Data = await RNFS.readFile(filePath, 'base64');

      // Debug: Only show first 100 chars

      let pdf;
      try {
        pdf = await pdfjsLib.getDocument({
          data: Buffer.from(base64Data, 'base64'),
        }).promise;
      } catch (err) {
        Alert.alert('Error', 'Invalid or corrupted PDF.');
        return '';
      }

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        let page;
        try {
          page = await pdf.getPage(i);
        } catch (err) {
          Alert.alert('Error', 'Unable to read PDF pages.');
          return '';
        }

        const content = await page.getTextContent().catch(() => null);
        if (!content) {
          Alert.alert('Error', 'Unable to extract PDF text.');
          return '';
        }

        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }

      return fullText;
    } catch (err) {
      console.log('Top-level error:', err);

      // Alert.alert('Error', 'Something went wrong while reading the PDF.');
      return '';
    }
  };

  const handlePDF = async () => {
    if (!file) return Alert.alert('Select a file first');
    const text = await extractTextFromPDF(file);
    setExtractedText(text);
  };

  // Upload & Analyze File
  const uploadFile = async () => {
    //openai Secret Key=   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
    if (!file) {
      Alert.alert('Error', 'Please select a resume first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });

      Alert.alert('dat format pdf', JSON.stringify(formData, null));

      // Replace with your backend API endpoint
      // const response = await fetch(
      //   'https://your-backend-url.com/api/analyze-resume',
      //   {
      //     method: 'POST',
      //     body: formData,
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   },
      // );

      const OPENAI_API_KEY =
        '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';

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a career assistant analyzing resumes.',
              },
              {
                role: 'user',
                content: 'Analyze this resume text: ... (hello)',
              },
            ],
          }),
        },
      );

      // ✅ Read JSON only once
      const data = await response.json();

      // Show full API response for debugging
      Alert.alert('OpenAI Response Debug', JSON.stringify(data, null, 2));

      // Extract AI message text safely
      const aiMessage =
        data?.choices?.[0]?.message?.content || 'No content returned';

      // Log and set state
      console.log(aiMessage);
      setAnalysisResult(aiMessage);

      // const result = await response.json();
      // setAnalysisResult(result);
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

          <View style={styles.spacer}>
            <Button
              title="Extract Text"
              onPress={handlePDF}
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
