import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  // StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import styles from '../styles/AiStyles';


export default function AIChat({userData, setActiveScreen, onLogout}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      setLoading(true);

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer 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',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            // messages: updatedMessages,
            messages: [{role: 'user', content: input}],
          }),
        },
      );

      const data = await response.json();
      Alert.alert('Error', JSON.stringify(data, null));

      const botMessage = {
        id: Date.now().toString() + '_ai',
        role: 'ai',
        content: data.choices[0].message.content, // OpenAI response
      };

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);

      // Scroll to bottom
      flatListRef.current?.scrollToEnd({animated: true});
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };
  const goToUserProfile = () => {
    Alert.alert('User Profile', 'Profile screen coming soon...', [
      {
        text: 'OK',
        onPress: () => setActiveScreen('UserProfile'), // ✅ switch after OK
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>AI Chat</Text>
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
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingVertical: 10}}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.role === 'user' ? styles.userMessage : styles.aiMessage,
            ]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={{margin: 10}} />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('Home')}>
          <Text style={styles.downnavTitle}>CV Analyzer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveScreen('AIChat')}>
          <Text style={styles.downnavTitle}>AI Chat</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

