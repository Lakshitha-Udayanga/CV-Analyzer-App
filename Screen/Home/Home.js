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
      Alert.alert('Response', JSON.stringify(data));
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

  const renderJobRecommendations = result => {
    if (!result) return null;

    const recommendations = result.job_recommendations;
    const jobsList = result.jobs_list || [];

    if (!recommendations && jobsList.length === 0) return null;

    const bestMatch = recommendations?.best_match;

    const getJobEmoji = (title) => {
      const lowTitle = title?.toLowerCase() || '';
      if (lowTitle.includes('developer') || lowTitle.includes('engineer') || lowTitle.includes('software') || lowTitle.includes('tech') || lowTitle.includes('programmer')) return '💻';
      if (lowTitle.includes('design') || lowTitle.includes('ui') || lowTitle.includes('ux') || lowTitle.includes('graphic') || lowTitle.includes('creative')) return '🎨';
      if (lowTitle.includes('manager') || lowTitle.includes('lead') || lowTitle.includes('executive') || lowTitle.includes('director')) return '👔';
      if (lowTitle.includes('marketing') || lowTitle.includes('sales') || lowTitle.includes('business')) return '📈';
      if (lowTitle.includes('hr') || lowTitle.includes('human') || lowTitle.includes('recruit')) return '👥';
      if (lowTitle.includes('data') || lowTitle.includes('analyst') || lowTitle.includes('science')) return '📊';
      if (lowTitle.includes('mobile') || lowTitle.includes('android') || lowTitle.includes('ios')) return '📱';
      if (lowTitle.includes('cloud') || lowTitle.includes('aws') || lowTitle.includes('azure')) return '☁️';
      if (lowTitle.includes('security') || lowTitle.includes('cyber')) return '🛡️';
      return '💼';
    };

    return (
      <View style={styles.jobContainer}>
        <Text
          style={[styles.cvSectionTitle, {marginTop: 20, marginBottom: 15}]}>
          ✨ Job Recommendation
        </Text>

        {bestMatch && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: '#f0f7ff',
                borderTopWidth: 0,
                borderLeftWidth: 5,
                borderLeftColor: '#2f80ed',
                marginBottom: 25,
                padding: 20,
                borderRadius: 15,
                elevation: 4,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: '#2f80ed', fontSize: 14, marginBottom: 10},
              ]}>
              TOP MATCH FOR YOU
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#1a202c',
                    textTransform: 'capitalize',
                  }}>
                  {bestMatch.job_title}
                </Text>
                <Text style={{color: '#4a5568', marginTop: 4, fontSize: 14}}>
                  Based on your skill set and experience
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#2f80ed',
                  borderRadius: 35,
                  width: 70,
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#2f80ed',
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 32}}>
                  {getJobEmoji(bestMatch.job_title)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text
          style={[
            styles.cvSectionTitle,
            {fontSize: 18, color: '#333', marginBottom: 15},
          ]}>
          Available Positions ({jobsList.length})
        </Text>

        {jobsList.map((job, index) => (
          <View
            key={index}
            style={[
              styles.jobItem,
              {
                backgroundColor: 'white',
                padding: 18,
                borderRadius: 12,
                marginBottom: 15,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                borderLeftWidth: 4,
                borderLeftColor: index % 2 === 0 ? '#2f80ed' : '#27ae60',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <Text
                style={[
                  styles.jobTitle,
                  {color: '#2d3748', fontSize: 17, flex: 1, fontWeight: '700'},
                ]}>
                {job.title} - {job.experience_level}
              </Text>
              <View
                style={{
                  backgroundColor: '#edf2f7',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}>
                <Text
                  style={{color: '#4a5568', fontSize: 10, fontWeight: '600'}}>
                  {job.job_type}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 6,
              }}>
              <Text style={{color: '#718096', fontSize: 14, fontWeight: '500'}}>
                {job.company_name}
              </Text>
              <Text style={{marginHorizontal: 8, color: '#cbd5e0'}}>•</Text>
              <Text style={{color: '#a0aec0', fontSize: 13}}>
                {job.location}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  backgroundColor: '#f0fff4',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginRight: 10,
                  marginBottom: 5,
                }}>
                <Text
                  style={{color: '#38a169', fontSize: 12, fontWeight: 'bold'}}>
                  Rs. {parseFloat(job.salary_min).toLocaleString()} -{' '}
                  {parseFloat(job.salary_max).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={{marginTop: 12}}>
              <Text style={{color: '#718096', fontSize: 12, fontWeight: '600'}}>
                Required Skills:
              </Text>
              <Text
                style={{
                  color: '#4a5568',
                  fontSize: 13,
                  marginTop: 2,
                  lineHeight: 18,
                }}>
                {job.skills}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#2f80ed',
                marginTop: 15,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                shadowColor: '#2f80ed',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              onPress={() => {
                const url = job.link.startsWith('http')
                  ? job.link
                  : `https://${job.link}`;
                Linking.openURL(url).catch(err =>
                  console.error("Couldn't load page", err),
                );
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
                Apply Now
              </Text>
            </TouchableOpacity>
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
            <Button title="Clear" onPress={clearResponse} color="#dc3545" />
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

              {renderJobRecommendations(analysisResult)}
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
