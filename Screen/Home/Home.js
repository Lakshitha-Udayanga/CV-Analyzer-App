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
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import styles from '../styles/HomeStyles';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const chartColors = [
  '#2f80ed',
  '#27ae60',
  '#f2c94c',
  '#eb5757',
  '#9b59b6',
  '#2d9cdb',
  '#db812d',
];

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
      setFile(res[0]);
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
      console.log(`Response: ${JSON.stringify(data)}`);

      Alert.alert('Login Successful', `CV Uploaded and analyzed successfully.`);

      setAnalysisResult(data);
      setLoading(false);

      // const result = await response.json();
      // setAnalysisResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload & analyze resume.');
    }
    setLoading(false);
  };

  const clearResponse = () => {
    setFile(null);
    setAnalysisResult(null);
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

  const renderJobRecommendations = jobs => {
    if (!jobs || jobs.length === 0) return null;

    const chartData = jobs.map((job, index) => ({
      name: job.title || 'N/A',
      population: Math.round(parseFloat(job.final_score)) || 0,
      color: chartColors[index % chartColors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    return (
      <View style={styles.jobContainer}>
        <Text style={styles.cvSectionTitle}>
          ============== Recommended Jobs ==================
        </Text>

        <View style={styles.chartContainer}>
          <Text
            style={[styles.cardTitle, {color: '#333', textAlign: 'center'}]}>
            Job Match Portfolio
          </Text>
          <PieChart
            data={chartData}
            width={screenWidth - 80}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            absolute
          />
        </View>

        {jobs.map((job, index) => (
          <View key={index} style={styles.jobItem}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobScore}>Match Score: {job.final_score}%</Text>
            {job.company_name && (
              <Text style={styles.jobDescription}>
                Company: {job.company_name}
              </Text>
            )}
            {job.link && (
              <TouchableOpacity
                onPress={() => {
                  const url = job.link.startsWith('http')
                    ? job.link
                    : `https://${job.link}`;
                  Linking.openURL(url).catch(err =>
                    console.error("Couldn't load page", err),
                  );
                }}>
                <Text style={[styles.jobDescription, {color: '#007bff'}]}>
                  View Job: {job.link}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

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
              title="Analyze & RECOMMENDATIONS JOBS"
              onPress={uploadFile}
              disabled={loading}
            />
          </View>

          <View style={styles.spacer}>
            <Button
              title="Clear"
              onPress={clearResponse}
              color="#dc3545"
            />
          </View>

          {loading && (
            <ActivityIndicator size="large" style={{marginTop: 20}} />
          )}

          {analysisResult && analysisResult.parsed_data && (
            <>
              <View style={[styles.card, {borderTopColor: '#2f80ed'}]}>
                <Text style={[styles.cardTitle, {color: '#2f80ed'}]}>
                  Professional Summary
                </Text>
                <Text style={styles.summaryText}>
                  {analysisResult.parsed_data.summary}
                </Text>
              </View>

              {renderList(
                'Strengths',
                analysisResult.parsed_data.strengths,
                '#27ae60',
              )}

              {renderList(
                'Technical Skills',
                analysisResult.parsed_data.skills ||
                  analysisResult.parsed_data.technical_skills,
                '#2d9cdb',
              )}

              {renderList(
                'Soft Skills',
                analysisResult.parsed_data.soft_skills,
                '#db812d',
              )}

              {renderList(
                'Certificates',
                analysisResult.parsed_data.certifications ||
                  analysisResult.parsed_data.certificates,
                '#f2c94c',
              )}

              {renderList(
                'Experiences',
                analysisResult.parsed_data.experiences,
                '#9b59b6',
              )}

              {renderList(
                'Weaknesses',
                analysisResult.parsed_data.weaknesses,
                '#eb5757',
              )}

              {renderJobRecommendations(analysisResult.job_recommendations)}
            </>
          )}
        </SafeAreaView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
