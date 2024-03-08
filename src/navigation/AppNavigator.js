import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image } from 'react-native';
import LoginScreen from '../views/LoginScreen';
import HomeScreen from '../views/HomeScreen';
import UploadTextScreen from '../views/UploadTextScreen';
import Background from '../components/BackgroundComponent'; // Adjust the import path as necessary
import GeneratedQuestionsScreen from '../views/GeneratedQuestionsScreen';
import QuizPageScreen from '../views/QuizPageScreen';


// Import your left arrow image
import LeftArrowIcon from '../assets/images/leftArrow.png';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Background>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // This will hide the header for all screens by default
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="UploadTextScreen"
          component={UploadTextScreen}
          options={({ navigation }) => ({
            headerShown: true, // Show the header for this screen
            headerTransparent: true, // Make the header transparent
            headerTitle: '', // Optionally, you can remove the title or customize it
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <Image source={LeftArrowIcon} style={{ width: 25, height: 25, marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            // You might also want to adjust the headerTintColor if necessary, for better visibility against the background
            headerTintColor: '#fff', // This sets the back button and title (if any) color to white
          })}
        />
        <Stack.Screen
          name="GeneratedQuestionsScreen"
          component={GeneratedQuestionsScreen}
          options={({ navigation }) => ({
            headerShown: true, // Show the header for this screen
            headerTransparent: true, // Make the header transparent
            headerTitle: '', // Optionally, you can remove the title or customize it
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <Image source={LeftArrowIcon} style={{ width: 25, height: 25, marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            // You might also want to adjust the headerTintColor if necessary, for better visibility against the background
            headerTintColor: '#fff', // This sets the back button and title (if any) color to white
          })}
        /> 
        <Stack.Screen
          name="QuizPageScreen"
          component={QuizPageScreen}
          options={({ navigation }) => ({
            headerShown: true, // Show the header for this screen
            headerTransparent: true, // Make the header transparent
            headerTitle: '', // Optionally, you can remove the title or customize it
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('GeneratedQuestionsScreen')}>
                <Image source={LeftArrowIcon} style={{ width: 25, height: 25, marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            // You might also want to adjust the headerTintColor if necessary, for better visibility against the background
            headerTintColor: '#fff', // This sets the back button and title (if any) color to white
          })}
        /> 
      </Stack.Navigator>
    </Background>
  );
}

export default AppNavigator;