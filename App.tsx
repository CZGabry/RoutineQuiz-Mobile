import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { navigationRef } from './src/navigation/NavigationService';
import * as RootNavigation from './src/navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';
import "core-js/stable/atob";
function App() {

  const checkLoginAndRedirect = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('User Token:', userToken);
      if (userToken) {
        const decodedToken = jwtDecode(userToken);
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          await AsyncStorage.removeItem('userToken');
          RootNavigation.navigate('LoginScreen');
        } else {
          RootNavigation.navigate('HomeScreen');
        }
        RootNavigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  PushNotification.createChannel(
    {
      channelId: "default-channel-id", // replace with your channel id
      channelName: "Your Channel Name", // replace with your channel name
      channelDescription: "A channel to categorise your notifications", // optional description
      soundName: "default", // optional. See `soundName` parameter of `localNotification` function
      importance: 4, // optional. See `importance` parameter of `createChannel`. Default is 4
      vibrate: true, // optional. Default is true.
    },
    (created) => console.log(`CreateChannel returned '${created}'`) // optional callback returns whether the channel was created or already existed.
  );
    
  const getToken = async() => {
      const token = await messaging().getToken();
      console.log("token");
      console.log(token);
      await AsyncStorage.setItem('deviceToken', token);
    }

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Add your background message handling logic here
    });

  useEffect(() => {
    requestUserPermission();
    getToken();
    checkLoginAndRedirect();
  },[])

  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Notification clicked', notification);
      // Assuming the app is fully initialized here; if not, consider using AsyncStorage to temporarily store this data
      const quizId = notification.data?.questionid;
      
      if (quizId) {
        console.log('Navigate to quiz page with quiz id:', quizId);
        setTimeout(() => {
          RootNavigation.navigate('QuizPageScreen', {
            quizId: quizId
          });
        }, 1000); // Adjust delay as needed based on your app's initialization time
      }
    },
  });
  

  useEffect(() => {
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);

      PushNotification.localNotification({
      channelId: "default-channel-id",
      title: remoteMessage.notification?.title || "Default Title",
      message: remoteMessage.notification?.body || "Default message",
      userInfo: { questionid: remoteMessage.data?.questionid },
      });
});
  
    return unsubscribe;
  }, []);
  
  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}><AppNavigator /></NavigationContainer>
  );

}

export default App;