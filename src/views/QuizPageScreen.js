import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizPageScreen = ({ route }) => {
  const { quizId, questionIndex } = route.params;
  const [question, setQuestion] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.error('User token not found in async storage');
        return;
      }
      console.log('Fetching quiz details for quiz ID:', quizId);
      console.log('Quiz ID:', questionIndex);
      axios.get(`http://10.0.2.2:3000/api/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })
      .then(response => {
          console.log('Response:', response.data);
          setQuestion(response.data.quiz); // Adjust according to your API response structure
        })
      .catch(error => {
          console.error('Error fetching quiz details:', error);
      });
    };

    fetchQuizDetails();
  }, [quizId]);

  const checkAnswer = (selectedOptionIndex) => {
    if (!question) return; // Check if the question data has been loaded

    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.correct_answer);
    if (selectedOptionIndex === correctAnswerIndex) {
      setFeedbackMessage('Correct Answer!');
    } else {
      setFeedbackMessage('Wrong Answer.');
    }
  };

  if (!question) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
  <Text style={styles.question}>
    {typeof questionIndex === 'number' ? `${questionIndex + 1}. ${question.question}` : `${question.question}`}
  </Text>
  {question.options.map((option, index) => (
    <TouchableOpacity
      key={index}
      style={styles.option}
      onPress={() => checkAnswer(index)}>
      <Text>{option}</Text>
    </TouchableOpacity>
  ))}
  {feedbackMessage ? <Text style={styles.feedback}>{feedbackMessage}</Text> : null}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  option: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  feedback: {
    marginTop: 20,
    fontSize: 18,
    color: 'green', // Feel free to change the color based on your design
  },
});

export default QuizPageScreen;