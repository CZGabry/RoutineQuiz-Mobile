import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Config from '../../config';

const UploadTextScreen = ({ navigation }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendText = () => {
    setLoading(true);
    setMessage(''); // Reset message on new request

    AsyncStorage.getItem('userToken').then((userToken) => {
      if (userToken) {
        const payload = {
          text: textInput,
          number_of_questions: selectedNumber,
          user_token: userToken,
        };

        axios.post(Config.API_URL + '/upload_note', payload)
          .then(response => {
            console.log('Upload successful:', response.data);
            setMessage('Questions generated');
            // Optional: Navigate to another screen upon success
            // navigation.navigate('HomeScreen');
          })
          .catch(error => {
            console.log('Upload failed:', error);
            setMessage(error.response?.data.error || 'Upload failed. Please try again.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        console.log('User token not found');
        setMessage('User token not found. Please login again.');
        setLoading(false);
      }
    }).catch(error => {
      console.log('Error getting user token:', error);
      setMessage('An error occurred. Please try again.');
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paste your text and get your quiz</Text>
      <TextInput
        multiline
        numberOfLines={7}
        style={styles.textInput}
        onChangeText={setTextInput}
        value={textInput}
      />
      <Text style={styles.questions}>Questions to generate:</Text>
      <Picker
        selectedValue={selectedNumber}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedNumber(itemValue)}
        dropdownIconColor={"#373738"} // Adjust the dropdown icon color if needed
      >
        {Array.from({ length: 16 }, (_, i) => (
          <Picker.Item key={i} label={`${i + 5}`} value={i + 5} />
        ))}
      </Picker>
      {message !== '' && <Text>{message}</Text>}
      <TouchableOpacity style={styles.uploadButton} onPress={sendText} disabled={loading}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5, // Add slight rounding to the text input
    maxHeight: 250,
  },
  picker: {
    width: 100, // Adjust the width as needed to make the picker tighter
    height: 50,
    marginBottom: 20,
    backgroundColor: 'transparent', // Optional: Adjust background color
    paddingEnd: 10,
  },
  uploadButton: {
    backgroundColor: '#373738',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20, // Rounded corners
    elevation: 3, // Add shadow for Android (optional)
    // For iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text color
    fontWeight: 'bold',
    fontSize: 15,
  },
  title: {
    fontFamily: 'Cheveuxdange',
    fontSize: 20,
    marginBottom: 50, // Adjust spacing between title and the next element
    marginTop: -10, // Optionally adjust this to move the title higher
  },
  questions: {
    fontFamily: 'Cheveuxdange',
    fontSize: 20,
    marginBottom: 5, // Adjust spacing between title and the next element
    marginTop: 20, // Optionally adjust this to move the title higher
  },
});

export default UploadTextScreen;
