import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Image } from 'react-native';
import LoginScreen from '../views/LoginScreen';
import HomeScreen from '../views/HomeScreen';
import UploadTextScreen from '../views/UploadTextScreen';
import GeneratedSetsScreen from '../views/GeneratedSetsScreen';
import Background from '../components/BackgroundComponent'; // Adjust the import path as necessary
import GeneratedQuestionsScreen from '../views/GeneratedQuestionsScreen';
import QuizPageScreen from '../views/QuizPageScreen';
import RoutineManagerScreen from '../views/RoutineManagerScreen';
import LeftArrowIcon from '../assets/images/leftArrow.png';
import styles from '../styles/AppStyles'; 
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
                <Image source={LeftArrowIcon} style={styles.leftArrowIcon} />
              </TouchableOpacity>
            ),
            // You might also want to adjust the headerTintColor if necessary, for better visibility against the background
            headerTintColor: '#fff', // This sets the back button and title (if any) color to white
          })}
        />
        <Stack.Screen
          name="GeneratedSetsScreen"
          component={GeneratedSetsScreen}
          options={({ navigation }) => ({
            headerShown: true, // Show the header for this screen
            headerTransparent: true, // Make the header transparent
            headerTitle: '', // Optionally, you can remove the title or customize it
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <Image source={LeftArrowIcon} style={styles.leftArrowIcon} />
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
              <TouchableOpacity onPress={() => navigation.navigate('GeneratedSetsScreen')}>
                <Image source={LeftArrowIcon} style={styles.leftArrowIcon} />
              </TouchableOpacity>
            ),
            // You might also want to adjust the headerTintColor if necessary, for better visibility against the background
            headerTintColor: '#fff', // This sets the back button and title (if any) color to white
          })}
        /> 
        <Stack.Screen
          name="RoutineManagerScreen"
          component={RoutineManagerScreen}
          options={({ navigation }) => ({
            headerShown: true, // Show the header for this screen
            headerTransparent: true, // Make the header transparent
            headerTitle: '', // Optionally, you can remove the title or customize it
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                <Image source={LeftArrowIcon} style={styles.leftArrowIcon} />
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
              <TouchableOpacity onPress={() => navigation.navigate('GeneratedSetsScreen')}>
                <Image source={LeftArrowIcon} style={styles.leftArrowIcon} />
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


