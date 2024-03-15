import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userName');
    navigation.navigate('Login'); // Assuming 'Login' is the route name for the login screen
  };

  // Example functions for your buttons
  const generateQuiz = () => navigation.navigate('UploadTextScreen');
  const generatedQuiz = () => navigation.navigate('GeneratedQuestionsScreen');
  const routineManager = () => navigation.navigate('RoutineManagerScreen');

  return (
    <ImageBackground source={require('../assets/images/homePageLogo.jpg')} style={styles.backgroundImage}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[styles.customFont, styles.welcomeText]}>Welcome to R-Quiz!</Text>
        
        <TouchableOpacity style={[styles.button, styles.transparentButton]} onPress={generateQuiz}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.transparentButton]} onPress={generatedQuiz}>
          <Text style={styles.buttonText}>Generated</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.transparentButton]} onPress={routineManager}>
          <Text style={styles.buttonText}>Routine</Text>
        </TouchableOpacity>
        
        {/* Uncomment if logout button is needed */}
        <TouchableOpacity style={[styles.button, styles.transparentButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Cover the entire screen
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10, // Adjust based on your layout needs
    marginTop: 10, // Add space between buttons
    alignSelf: 'stretch', // Make buttons stretch to match parent width
    margin: 20, // Ensure some space around the button
  },
  transparentButton: {
    backgroundColor: 'rgba(0,0,0,0)', // Transparent background
  },
  buttonText: {
    fontFamily: 'Cheveuxdange', // Ensure the name matches the font file
    fontSize: 26,
    color: 'black', // Updated to black
    textAlign: 'center',
  },
  customFont: {
    fontFamily: 'Cheveuxdange', // Ensure this matches your font's name
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20, // Space above the buttons
  },
});

export default HomeScreen;
