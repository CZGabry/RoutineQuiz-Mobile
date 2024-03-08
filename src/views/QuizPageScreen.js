import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizPageScreen = ({ route }) => {
  const { question, questionIndex } = route.params;
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Step 2: State for the feedback message

  const checkAnswer = (selectedOptionIndex) => {
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.correct_answer);
    if (selectedOptionIndex === correctAnswerIndex) {
      setFeedbackMessage('Correct Answer!'); // Step 3: Set success message
    } else {
      setFeedbackMessage('Wrong Answer.'); // Step 3: Set failure message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{`${questionIndex + 1}. ${question.question}`}</Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => checkAnswer(index)}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
      {/* Step 4: Display the feedback message */}
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