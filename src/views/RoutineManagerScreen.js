import React, { useState, useEffect } from 'react';
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
  const [hours, setHours] = useState([]);
  const [showPicker, setShowPicker] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('userToken').then(userToken => {
      if (userToken) {
        axios.get('http://10.0.2.2:3000/api/getroutine', {
          headers: { Authorization: `Bearer ${userToken}` },
        })
          .then(response => {
            const { days, hours } = response.data.routine;
            if (days.length > 0 && hours.length > 0) {
              // Set selected days
              setSelectedDays(days);
  
              // Convert string hours to Date objects
              const routineHours = hours.map(timeString => {
                const [hour, minute] = timeString.split(':');
                const date = new Date();
                date.setHours(+hour, +minute, 0);
                return date;
              });
              setHours(routineHours);
  
              // Prepare showPicker state based on the hours
              setShowPicker(routineHours.map(() => false));
            } else {
              // Handle case where there are no routines
              setMessage('No routines found.');
            }
          })
          .catch(error => {
            console.error('Failed to fetch routines:', error);
            setMessage('Failed to load routines. Please try again later.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setMessage('User token not found. Please login again.');
        setLoading(false);
      }
    }).catch(error => {
      console.error('AsyncStorage error:', error);
      setMessage('An error occurred while accessing local storage. Please try again.');
      setLoading(false);
    });
  }, []);
  
  

  const handleDayToggle = (dayValue) => {
    if (dayValue === 0) { // 'All'
      setSelectedDays(selectedDays.length < daysOfWeek.length - 1 ? daysOfWeek.slice(1).map(day => day.value) : []);
    } else {
      setSelectedDays(selectedDays.includes(dayValue) ? selectedDays.filter(d => d !== dayValue) : [...selectedDays, dayValue].sort());
    }
  };

  const handleHourChange = (event, selectedDate, index) => {
    const updatedHours = [...hours];
    updatedHours[index] = selectedDate || hours[index];
    setHours(updatedHours);
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

  const submitRoutine = async () => {
    setLoading(true);
    setMessage('');
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        const payload = {
          selectedDays,
          hours: hours.map(hour => hour.toISOString()),
          user_token: userToken,
        };
        const response = await axios.post('http://10.0.2.2:3000/api/setroutine', payload);
        setMessage('Routine saved successfully');
      } else {
        setMessage('User token not found. Please login again.');
      }
    } catch (error) {
      setMessage('Failed to save routine. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Days</Text>
      <View style={styles.daysRow}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day.value}
            onPress={() => handleDayToggle(day.value)}
            style={selectedDays.includes(day.value) ? styles.dayButtonSelected : styles.dayButton}
          >
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
      <Button onPress={submitRoutine} title="Submit" disabled={loading} />
      {message ? <Text>{message}</Text> : null}
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  dayButtonSelected: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: '#e0f0ff',
    marginBottom: 5,
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
