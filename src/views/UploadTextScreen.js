import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

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

        axios.post('http://10.0.2.2:3000/api/upload_note', payload)
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
      <TextInput
        multiline
        numberOfLines={4}
        placeholder="Enter your text here"
        style={styles.textInput}
        onChangeText={setTextInput}
        value={textInput}
      />
      <Picker
        selectedValue={selectedNumber}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedNumber(itemValue)}>
        {Array.from({ length: 20 }, (_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>
      {message !== '' && <Text>{message}</Text>}
      <Button title="Upload" onPress={sendText} disabled={loading} />
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
  },
  picker: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
});

export default UploadTextScreen;
