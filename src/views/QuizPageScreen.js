import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../config';

const QuizPageScreen = ({ route }) => {
  const { quizId, questionIndex } = route.params;
  const [question, setQuestion] = useState(null);
  // Updated to include both message and a flag indicating if the answer is correct
  const [feedback, setFeedback] = useState({message: '', isCorrect: false});

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.error('User token not found in async storage');
        return;
      }
      console.log('Fetching quiz details for quiz ID:', quizId);
      axios.get(`${Config.API_URL}/quizzes/${quizId}`, {
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
    if (!question) return;

    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.correct_answer);
    if (selectedOptionIndex === correctAnswerIndex) {
      setFeedback({message: 'Correct Answer!', isCorrect: true});
    } else {
      setFeedback({message: 'Wrong Answer.', isCorrect: false});
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
      {/* Adjust the feedback style based on the answer correctness */}
      {feedback.message ? (
        <Text style={[styles.feedback, feedback.isCorrect ? null : styles.wrongAnswer]}>
          {feedback.message}
        </Text>
      ) : null}
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
    color: 'green',
  },
  wrongAnswer: {
    color: 'red', // Style for wrong answers
  },
});

export default QuizPageScreen;
