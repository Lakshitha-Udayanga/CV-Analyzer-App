import React, {useState} from 'react';
import {View} from 'react-native';
import LoginScreen from './LoginScreen';
import HomeScreen from './Screen/Home/Home';
import AIChat from './Screen/Home/AIChat';
import UserProfile from './Screen/User/UserProfile';
import RegisterAdd from './Screen/Register/RegisterAdd';
import AboutApp from './Screen/About/AboutApp';


export default function App() {
  const [activeScreen, setActiveScreen] = useState('Login'); 
  const [userData, setUserData] = useState(null);

  // when login is successful
  const onLoginSuccess = data => {
    setUserData(data);
    setActiveScreen('Home'); 
  };

  // logout function
  const onLogout = () => {
    setUserData(null);
    setActiveScreen('Login');
  };

  // logout function
  const onRegister = () => {
    setUserData(null);
    setActiveScreen('RegisterAdd');
  };

  return (
    <View style={{flex: 1}}>
      {activeScreen === 'Login' && (
        <LoginScreen onLoginSuccess={onLoginSuccess}
          onRegister={onRegister}
        
        />
      )}
      {activeScreen === 'Home' && (
        <HomeScreen
          userData={userData}
          setActiveScreen={setActiveScreen} // ✅ pass here
          onLogout={onLogout}
        />
      )}
      {activeScreen === 'AIChat' && (
        <AIChat
          userData={userData}
          setActiveScreen={setActiveScreen} // ✅ pass here
          onLogout={onLogout}
        />
      )}

      {activeScreen === 'UserProfile' && (
        <UserProfile
          userData={userData}
          setActiveScreen={setActiveScreen} // ✅ pass here
          onLogout={onLogout}
        />
      )}

      {activeScreen === 'RegisterAdd' && (
        <RegisterAdd
          userData={userData}
          setActiveScreen={setActiveScreen} // ✅ pass here
          onLogout={onLogout}
          onRegister={onRegister}
        />
      )}

      {activeScreen === 'AboutApp' && (
        <AboutApp
          userData={userData}
          setActiveScreen={setActiveScreen} // ✅ pass here
          onLogout={onLogout}
        />
      )}
    </View>
  );
}
