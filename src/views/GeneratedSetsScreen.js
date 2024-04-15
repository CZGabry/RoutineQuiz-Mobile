import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config';
import { useFocusEffect } from '@react-navigation/native';

const SetItem = ({ item, index, navigation }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('GeneratedQuestionsScreen', { setId: item.set_id })}
    >
      <Animated.View style={{ ...styles.cellWrapper, opacity }}>
        <Text style={styles.cell}>{`${index + 1} - ${item.topic} (${item.number_of_questions} questions)`}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const GeneratedSetsScreen = ({ navigation }) => {
  const [sets, setSets] = useState([]);

  const fetchSets = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.error('User token not found in async storage');
      return;
    }

    axios.get(`${Config.API_URL}/get_sets_by_user`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .then(response => {
      setSets(response.data.sets); // Assuming the API response structure
    })
    .catch(error => {
      console.error('Error making request:', error);
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchSets();
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sets</Text>
      </View>
      <FlatList
        data={sets}
        renderItem={({ item, index }) => (
          <SetItem item={item} index={index} navigation={navigation} />
        )}
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
    fontSize: 25,
    fontFamily: 'Cheveuxdange',
    marginBottom: 20,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF', // Light background
    borderRadius: 8, // Rounded corners
    shadowColor: "#000", // Shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android
  },
  cell: {
    margin: 5,
    flexShrink: 1,
    fontSize: 16, // Slightly larger text
    color: '#333', // Darker text color for better readability
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default GeneratedSetsScreen;
