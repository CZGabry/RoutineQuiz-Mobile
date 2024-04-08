import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config';

const GeneratedQuestionsScreen = ({navigation, route}) => {
  const { setId } = route.params;
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }
  
    axios.get(`${Config.API_URL}/quizzes_by_set/${setId}`, { // Use `setId` in the API endpoint or as a parameter
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
    });
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const deleteQuiz = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }
  
    axios.delete(`${Config.API_URL}/delete_quiz/${setId}`, { // Modify as needed based on how your API expects to receive `setId`
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
      console.log('Quiz deleted:', response.data);
      navigation.navigate('GeneratedSetsScreen'); // Refresh the quizzes list after deletion
    })
    .catch(error => {
      console.error('Error deleting quiz:', error);
    });
  };

  const renderItem = ({ item, index }) => (
    console.log(item),
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('QuizPageScreen', {
        quizId: item.quiz_id,
        questionIndex: index
      })}// Placeholder for your click handling logic
    >
      <Text style={styles.cell}>{`${index + 1}. ${item.question}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quizzes</Text>
        {quizzes != undefined && quizzes.length > 0 && (
        <TouchableOpacity onPress={deleteQuiz} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
      </View>
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
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    paddingVertical: 5, // Riduce il padding verticale per rendere il bottone più basso
    paddingHorizontal: 10, // Mantiene un padding orizzontale per non stringere il testo ai lati
    backgroundColor: 'red', // Stile di esempio
    borderRadius: 5, // Aggiunge bordi arrotondati con un raggio di 20px
},
  deleteButtonText: {
    color: 'white',
  },
});

export default GeneratedQuestionsScreen;