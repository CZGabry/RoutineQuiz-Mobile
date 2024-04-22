import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Config from '../../config';

function LoginScreen() {
  const [userData, setUserData] = useState({ identifier: '', password: '', device_token: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('Attempting login :', Config.API_URL +'/login');
    
    userData.device_token = await AsyncStorage.getItem('deviceToken');
    console.log('token login :', userData.device_token);
    axios.post(Config.API_URL +'/login', userData)
      .then(async response => {
        console.log('Login successful:', response.data.token);
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userName', response.data.username);
        navigation.navigate('HomeScreen');
      })
      .catch(error => {
        console.log('Login failed:', error);
        setErrorMessage(error.response?.data.error || 'Login failed. Please try again.');
      });
  };

  return (
    <ImageBackground 
        source={require('../assets/images/logo3.jpg')} 
        style={styles.background}>
      <Text style={[styles.customFont, styles.welcomeText]}>R-QUIZ</Text>
      <View style={styles.container}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={userData.identifier}
          onChangeText={text => setUserData({ ...userData, identifier: text })}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={userData.password}
          onChangeText={text => setUserData({ ...userData, password: text })}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const d = Dimensions.get("window");
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: d.width,
    height: d.height,
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: 'rgba(184, 201, 208, 0.85)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'BookletCordel',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    fontFamily: 'BookletCordel',
    color: '#000',
    marginBottom: 4,
  },
  customFont: {
    fontFamily: 'Breathing',
  },
  welcomeText: {
    top: 25,
    fontSize: 30,
    marginBottom: 30,
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default LoginScreen;
