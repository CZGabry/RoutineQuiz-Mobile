import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GeneratedQuestionsScreen = ({navigation}) => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }

    axios.get('http://10.0.2.2:3000/api/quizzes', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
        console.log('Response:', response.data);
        setQuizzes(response.data.quizzes);
      })
    .catch(error => {
        console.error('Error making request:', error);
        console.log(error.config); // This will show you the request configuration
    });
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('QuizPageScreen', {
        question: item,
        questionIndex: index
      })}// Placeholder for your click handling logic
    >
      <Text style={styles.cell}>{`${index + 1}. ${item.question}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes</Text>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10, // Added for better touch feedback
  },
  cell: {
    margin: 5,
    flexShrink: 1,
  },
});

export default GeneratedQuestionsScreen;