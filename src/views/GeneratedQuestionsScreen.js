import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config';

// Separate component for rendering each quiz item with an animation
const QuizItem = ({ item, index, navigation }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('QuizPageScreen', {
        quizId: item.quiz_id,
        questionIndex: index
      })}
    >
      <Animated.View style={{ opacity }}>
        <Text style={styles.cell}>{`${index + 1}. ${item.question}`}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const GeneratedQuestionsScreen = ({ navigation, route }) => {
  const { setId } = route.params;
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.error('User token not found in async storage');
        return;
      }
  
      try {
        const response = await axios.get(`${Config.API_URL}/quizzes_by_set/${setId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error making request:', error);
      }
    };

    fetchQuizzes();
  }, [setId]);

  const deleteQuiz = async () => {
    console.log("Delete button pressed");
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }
  
    try {
      const response = await axios.delete(`${Config.API_URL}/delete_quiz/${setId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      console.log('Quiz deleted:', response.data);
      navigation.goBack(); // Consider using goBack to return to the previous screen
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quizzes</Text>
        {quizzes.length > 0 && (
          <TouchableOpacity onPress={deleteQuiz} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={quizzes}
        renderItem={({ item, index }) => (
          <QuizItem item={item} index={index} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,  },
  title: {
    fontSize: 22, // Adjusted to match Sets page title size
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'Cheveuxdange',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF', // Light background for each item, assuming similarity
    borderRadius: 8, // Rounded corners for each item
    shadowColor: "#000", // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cell: {
    margin: 5,
    flexShrink: 1,
    fontSize: 16, // Assuming a larger font size for readability
  },
  header: {
    marginTopinTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold', // Assuming bold text for the button
  },
});

export default GeneratedQuestionsScreen;
