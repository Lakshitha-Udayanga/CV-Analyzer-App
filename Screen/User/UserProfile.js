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
} from 'react-native';
import styles from '../styles/UserProfileStyles';


export default function UserProfile({userData, setActiveScreen, onLogout}) {
  const [profileData, setProfileData] = useState([]);
  const [selectedCvIndex, setSelectedCvIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      console.log(
        `Fetching profile from: ${userData.baseUrl}/api/profile/${userData.id}`,
      );
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
        console.error(
          `Error ${response.status}: ${errorText || 'No error body'}`,
        );
        setLoading(false);
        return;
      }

      const responseText = await response.text();
      console.log(`Response adat: ${response.status} ${responseText}`);

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

  const cvList =
    profileData && profileData.length > 0
      ? profileData
      : userData?.cv_lists ?? [];

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

  const renderJobRecommendations = recommendations => {
    if (!recommendations || recommendations.length === 0) return null;

    const bestMatch = recommendations[0];
    const jobsList = bestMatch.matched_jobs || [];

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
          ✨ Job Recommendations
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
              <Text style={{color: '#a0aec0', fontSize: 13}}>{job.location}</Text>
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
                const cvPath = item.cv_url || item.file_path;
                const fullUrl = cvPath.startsWith('http')
                  ? cvPath
                  : `${baseUrl}${cvPath}`;
                const parsedInfo =
                  profileData &&
                  profileData.length > 0 &&
                  profileData.find(pd => pd.cv_url === fullUrl)
                    ? profileData.find(pd => pd.cv_url === fullUrl)
                    : item;
                const isExpanded = selectedCvIndex === index;

                return (
                  <View key={item.id || index} style={{marginBottom: 20}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => openCV(cvPath)}
                        style={{flex: 1}}>
                        <Text style={styles.linkText}>View CV {index + 1}</Text>
                      </TouchableOpacity>

                      {parsedInfo && (
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedCvIndex(isExpanded ? null : index)
                          }
                          style={[
                            styles.editButton,
                            {
                              backgroundColor: isExpanded
                                ? '#6c757d'
                                : '#1d5dbd',
                              width: 120,
                              marginTop: 0,
                            },
                          ]}>
                          <Text style={styles.editText}>
                            {isExpanded ? 'Hide Analysis' : 'Show Analysis'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Show Analysis if expanded and data available */}
                    {isExpanded && parsedInfo && !loading && (
                      <View style={{marginTop: 10}}>
                        {parsedInfo.summary && (
                          <View
                            style={[styles.card, {borderTopColor: '#2f80ed'}]}>
                            <Text
                              style={[styles.cardTitle, {color: '#2f80ed'}]}>
                              Professional Summary
                            </Text>
                            <Text style={styles.summaryText}>
                              {parsedInfo.summary}
                            </Text>
                          </View>
                        )}

                        {renderCVDataList(
                          'Strengths',
                          parsedInfo.strengths,
                          '#27ae60',
                        )}
                        {renderCVDataList(
                          'Technical Skills',
                          parsedInfo.skills || parsedInfo.technical_skills,
                          '#2d9cdb',
                        )}
                        {renderCVDataList(
                          'Soft Skills',
                          parsedInfo.soft_skills,
                          '#db812d',
                        )}
                        {renderCVDataList(
                          'Certificates',
                          parsedInfo.certifications || parsedInfo.certificates,
                          '#f2c94c',
                        )}
                        {renderCVDataList(
                          'Experiences',
                          parsedInfo.experiences,
                          '#9b59b6',
                        )}
                        {renderCVDataList(
                          'Weaknesses',
                          parsedInfo.weaknesses,
                          '#eb5757',
                        )}

                        {renderJobRecommendations(
                          parsedInfo.job_recommendations,
                        )}
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
                style={[
                  styles.editButton,
                  {width: '100%', marginBottom: 10, marginTop: 20},
                ]}
                onPress={fetchProfileData}>
                <Text style={[styles.editText, {textAlign: 'center'}]}>
                  Refresh Profile
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={{marginTop: 20}}
            />
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
