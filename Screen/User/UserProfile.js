import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import styles from '../styles/UserProfileStyles';
import {PieChart} from 'react-native-chart-kit';

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
  const [profileData, setProfileData] = useState([]);
  const [selectedCvIndex, setSelectedCvIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching profile from: ${userData.baseUrl}/api/profile/${userData.id}`);
      const response = await fetch(
        `${userData.baseUrl}/api/profile/${userData.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
          },
        },
      );

      console.log(`Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText || 'No error body'}`);
        setLoading(false);
        return;
      }

      const responseText = await response.text();
      if (!responseText) {
        console.error('Empty response body from server');
        setLoading(false);
        return;
      }

      const data = JSON.parse(responseText);
      if (data.status === 'success') {
        setProfileData(data.data);
      } else {
        console.error('Failed to fetch profile data:', data.message);
      }
    } catch (error) {
      console.error('Fetch profile data error:', error);
    } finally {
      setLoading(false);
    }
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

              if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to delete account.';
                try {
                  const errorData = JSON.parse(errorText);
                  errorMessage = errorData.message || errorMessage;
                } catch (e) {}
                Alert.alert('Error', errorMessage);
              } else {
                Alert.alert('Success', 'Account deleted successfully.');
                onLogout();
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

  const renderCVDataList = (title, items, color) => (
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
      name: job.job_title || 'N/A',
      population: parseInt(job.match_score) || 0,
      color: chartColors[index % chartColors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    return (
      <View style={styles.jobContainer}>
        <Text style={styles.cvSectionTitle}>
          =================== Recommended Jobs ====================
        </Text>

        <View style={styles.chartContainer}>
          <Text style={[styles.cardTitle, {color: '#333', textAlign: 'center'}]}>
            Job Match Portfolio
          </Text>
          <PieChart
            data={chartData}
            width={screenWidth - 60}
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
            <Text style={styles.jobTitle}>{job.job_title}</Text>
            <Text style={styles.jobScore}>Match Score: {job.match_score}%</Text>
            {job.company_name && (
              <Text style={styles.jobDescription}>Company: {job.company_name}</Text>
            )}
          </View>
        ))}
      </View>
    );
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
              cvList.map((item, index) => {
                // Find matching parsed data for this CV
                const fullUrl = item.file_path.startsWith('http') ? item.file_path : `${baseUrl}${item.file_path}`;
                const parsedInfo = profileData.find(pd => pd.cv_url === fullUrl);
                const isExpanded = selectedCvIndex === index;

                return (
                  <View key={item.id || index} style={{marginBottom: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => openCV(item.file_path)}
                        style={{flex: 1}}>
                        <Text style={styles.linkText}>View CV {index + 1}</Text>
                      </TouchableOpacity>
                      
                      {parsedInfo && (
                        <TouchableOpacity 
                          onPress={() => setSelectedCvIndex(isExpanded ? null : index)}
                          style={[styles.editButton, {backgroundColor: isExpanded ? '#6c757d' : '#1d5dbd', width: 120, marginTop: 0}]}>
                          <Text style={styles.editText}>{isExpanded ? 'Hide Analysis' : 'Show Analysis'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Show Analysis if expanded and data available */}
                    {isExpanded && parsedInfo && !loading && (
                      <View style={{marginTop: 10}}>
                        {parsedInfo.summary && (
                          <View style={[styles.card, {borderTopColor: '#2f80ed'}]}>
                            <Text style={[styles.cardTitle, {color: '#2f80ed'}]}>
                              Professional Summary
                            </Text>
                            <Text style={styles.summaryText}>{parsedInfo.summary}</Text>
                          </View>
                        )}

                        {renderCVDataList('Strengths', parsedInfo.strengths, '#27ae60')}
                        {renderCVDataList('Technical Skills', parsedInfo.skills, '#2d9cdb')}
                        {renderCVDataList('Soft Skills', parsedInfo.soft_skills, '#db812d')}
                        {renderCVDataList('Certificates', parsedInfo.certificates, '#f2c94c')}
                        {renderCVDataList('Experiences', parsedInfo.experiences, '#9b59b6')}
                        {renderCVDataList('Weaknesses', parsedInfo.weaknesses, '#eb5757')}

                        {renderJobRecommendations(parsedInfo.job_recommendations)}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text>No CVs Available</Text>
            )}

            {cvList.length > 0 && (
              <TouchableOpacity 
                style={[styles.editButton, {width: '100%', marginBottom: 10, marginTop: 20}]}
                onPress={fetchProfileData}>
                <Text style={[styles.editText, {textAlign: 'center'}]}>Refresh Profile</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {loading && (
            <ActivityIndicator size="large" color="#007bff" style={{marginTop: 20}} />
          )}
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


