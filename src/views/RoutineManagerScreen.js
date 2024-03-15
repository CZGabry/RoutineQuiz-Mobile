import React, { useState } from 'react';
import { ScrollView, Text, Button, TouchableOpacity, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const daysOfWeek = [
  { name: 'All', value: 0 },
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 7 },
];

const RoutineManager = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [hours, setHours] = useState([new Date()]);
  const [showPicker, setShowPicker] = useState([false]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const handleDayToggle = (dayValue) => {
  if (dayValue === 0) { // 'All'
    if (selectedDays.length < daysOfWeek.length - 1) { // Exclude 'All'
      setSelectedDays(daysOfWeek.slice(1).map(day => day.value)); // Exclude 'All' and map to values
    } else {
      setSelectedDays([]);
    }
  } else {
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter(d => d !== dayValue));
    } else {
      const updatedDays = [...selectedDays, dayValue];
      if (updatedDays.length === daysOfWeek.length - 1) { // Check against the length excluding 'All'
        setSelectedDays(daysOfWeek.slice(1).map(day => day.value)); // Exclude 'All' and map to values
      } else {
        setSelectedDays(updatedDays);
      }
    }
  }
};

  const handleHourChange = (event, selectedDate, index) => {
    const newHours = [...hours];
    newHours[index] = selectedDate || newHours[index];
    setHours(newHours);
    togglePicker(index);
  };

  const togglePicker = (index) => {
    const updatedShowPicker = [...showPicker];
    updatedShowPicker[index] = !updatedShowPicker[index];
    setShowPicker(updatedShowPicker);
  };

  const addHour = () => {
    setHours([...hours, new Date()]);
    setShowPicker([...showPicker, false]);
  };

  const submitRoutine = () => {
    setLoading(true);
    setMessage(''); // Reset message on new request

    AsyncStorage.getItem('userToken').then((userToken) => {
      if (userToken) {
        console.log("selectedDays");
    const formattedHours = hours.map(hour => hour.toLocaleTimeString());
    console.log({ selectedDays, hours: formattedHours });
    const payload = {
      hours: hours,
      selectedDays: selectedDays,
      user_token: userToken,
    };
    axios.post('http://10.0.2.2:3000/api/setroutine', payload)
          .then(response => {
            console.log('Upload successful:', response.data);
            setMessage('Routine generated');
            // Optional: Navigate to another screen upon success
            // navigation.navigate('HomeScreen');
          })
          .catch(error => {
            console.log('Routine failed:', error);
            setMessage(error.response?.data.error || 'Routine failed. Please try again.');
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
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Select Days</Text>
    <View style={styles.daysRow}>
      {daysOfWeek.slice(0, 4).map(day => ( // Adjusted to slice from 1 to exclude 'All' and split the first four days
        <TouchableOpacity key={day.value} onPress={() => handleDayToggle(day.value)} style={selectedDays.includes(day.value) ? styles.dayButtonSelected : styles.dayButton}>
          <Text style={selectedDays.includes(day.value) ? styles.dayTextSelected : styles.dayText}>
            {day.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.daysRow}>
      {daysOfWeek.slice(4).map(day => ( // Adjusted to slice from 5 to get the last three days
        <TouchableOpacity key={day.value} onPress={() => handleDayToggle(day.value)} style={selectedDays.includes(day.value) ? styles.dayButtonSelected : styles.dayButton}>
          <Text style={selectedDays.includes(day.value) ? styles.dayTextSelected : styles.dayText}>
            {day.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.title}>Select Hours</Text>
    {hours.map((hour, index) => (
      <View key={index} style={styles.hourRow}>
        <TouchableOpacity onPress={() => togglePicker(index)} style={styles.hourButton}>
          <Text>Select Hour: {hour.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showPicker[index] && (
          <DateTimePicker
            value={hour}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => handleHourChange(event, selectedDate, index)}
          />
        )}
      </View>
    ))}
    
    <Button onPress={addHour} title="Add Hour" disabled={hours.length >= 10} />
    <Button onPress={submitRoutine} title="Submit" />
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dayButtonSelected: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: '#e0f0ff',
  },
  dayText: {
    textAlign: 'center',
  },
  dayTextSelected: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'blue',
  },
  hourRow: {
    marginBottom: 5,
  },
  hourButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default RoutineManager;
