

import React, { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from './LoginScreen';
import HomeScreen from './Screen/Home/Home';
import AIChat from './Screen/Home/AIChat';
import UserProfile from './Screen/User/UserProfile';


export default function App() {
  const [activeScreen, setActiveScreen] = useState('Login'); // default screen
  const [userData, setUserData] = useState(null);

  // when login is successful
  const onLoginSuccess = (data) => {
    setUserData(data);
    setActiveScreen('Home'); // go to Home after login
  };

  // logout function
  const onLogout = () => {
    setUserData(null);
    setActiveScreen('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      {activeScreen === 'Login' && <LoginScreen onLoginSuccess={onLoginSuccess} />}
      {activeScreen === 'Home' && (
        <HomeScreen
          userData={userData}
          setActiveScreen={setActiveScreen}   // ✅ pass here
          onLogout={onLogout}
        />
      )}
      {activeScreen === 'AIChat' && (
        <AIChat
          userData={userData}
          setActiveScreen={setActiveScreen}   // ✅ pass here
          onLogout={onLogout}
        />
      )}

       {activeScreen === 'UserProfile' && (
        <UserProfile
          userData={userData}
          setActiveScreen={setActiveScreen}   // ✅ pass here
          onLogout={onLogout}
        />
      )}
    </View>
  );
}

