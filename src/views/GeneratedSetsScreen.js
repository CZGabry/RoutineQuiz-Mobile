import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config';
import { useFocusEffect } from '@react-navigation/native';

const GeneratedSetsScreen = ({ navigation }) => {
  const [sets, setSets] = useState([]);

  const fetchSets = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }

    axios.get(Config.API_URL + '/get_sets_by_user', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
        console.log('Response:', response.data);
        setSets(response.data.sets); // Assuming the API response structure
      })
    .catch(error => {
        console.error('Error making request:', error);
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchSets();
      // Optional: Return a callback to execute on component un-focus
      return () => {};
    }, [])
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('GeneratedQuestionsScreen', {
        setId: item.set_id,
      })}
    >
      <Text style={styles.cell}>{`${index + 1} - ${item.topic} (${item.number_of_questions} questions)`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sets</Text>
      </View>
      <FlatList
        data={sets}
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
    padding: 10,
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
});

export default GeneratedSetsScreen;
