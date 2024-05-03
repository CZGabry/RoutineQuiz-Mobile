import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../config';

const QuizPageScreen = ({ route }) => {
  const { quizId, questionIndex } = route.params;
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', explanation: '', isCorrect: false });
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Track the selected option
  const [answerSubmitted, setAnswerSubmitted] = useState(false); // State to disable further clicks once answer is submitted

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

    setFeedback({ message: '', explanation: '', isCorrect: false });
    setSelectedOptionIndex(null); // Reset the selected option when fetching new quiz details
    setAnswerSubmitted(false); // Reset interaction disable state
    fetchQuizDetails();
  }, [quizId]);

  const checkAnswer = (selectedOptionIndex) => {
    if (!question || answerSubmitted) return;

    setSelectedOptionIndex(selectedOptionIndex); // Update the selected option index
    setAnswerSubmitted(true); // Disable further interactions
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.correct_answer);
    const isCorrect = selectedOptionIndex === correctAnswerIndex;
    const feedbackMessage = isCorrect ? 'Correct Answer!' : 'Wrong Answer.';
    setFeedback({
      message: feedbackMessage,
      explanation: question.explanation, // Assuming this is how you access the explanation
      isCorrect: isCorrect,
    });
  };

  if (!question) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {typeof questionIndex === 'number' ? `${questionIndex + 1}. ${question.question}` : question.question}
      </Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            answerSubmitted && (selectedOptionIndex === index && feedback.isCorrect) ? styles.correctOption : null,
            answerSubmitted && (index === ['A', 'B', 'C', 'D'].indexOf(question.correct_answer) && !feedback.isCorrect) ? styles.correctOption : null,
            answerSubmitted && selectedOptionIndex === index && !feedback.isCorrect ? styles.incorrectOption : null,
          ]}
          onPress={() => checkAnswer(index)}
          disabled={answerSubmitted}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {feedback.message ? (
        <>
          <Text style={[styles.feedback, feedback.isCorrect ? null : styles.wrongAnswer]}>
            {feedback.message}
          </Text>
          <Text style={styles.explanation}>
            Explanation: {feedback.explanation}
          </Text>
        </>
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
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color:'#373738'
  },
  option: {
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#f0f0f0', // Default background color for options
    borderRadius: 8, // Matching the styling of options/buttons
  },
  optionText: {
    fontSize: 15,
  },
  correctOption: {
    backgroundColor: 'green', // Correct answer background color
  },
  incorrectOption: {
    backgroundColor: 'red', // Incorrect answer background color
  },
  feedback: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
  wrongAnswer: {
    color: 'red',
  },
  explanation: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default QuizPageScreen;
