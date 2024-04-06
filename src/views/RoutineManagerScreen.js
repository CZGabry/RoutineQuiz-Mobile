import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Button, TouchableOpacity, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../../config';
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
  const [isSelectingNewHour, setIsSelectingNewHour] = useState(false);
  const [newHourTime, setNewHourTime] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('userToken').then(userToken => {
      if (userToken) {
        axios.get(Config.API_URL +'/getroutine', {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then(response => {
          const { days, hours } = response.data.routine;
          if (days.length > 0 && hours.length > 0) {
            setSelectedDays(days);
        
            const routineHours = hours.map(({id, time}) => {
              const [hour, minute] = time.split(':');
              const date = new Date();
              date.setHours(+hour, +minute, 0);
              return { id, time: date };
            });
            setHours(routineHours);
            setShowPicker(routineHours.map(() => false));
          } else {
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
    if (dayValue === 0) {
      const isSelectingAll = selectedDays.length < daysOfWeek.length - 1;
      setSelectedDays(isSelectingAll ? daysOfWeek.slice(1).map(day => ({ day: day.value, id: day.value })) : []);
    } else {
      const dayExists = selectedDays.some(selectedDay => selectedDay.day === dayValue);
      if (dayExists) {
        setSelectedDays(selectedDays.filter(selectedDay => selectedDay.day !== dayValue));
      } else {
        setSelectedDays([...selectedDays, { day: dayValue, id: dayValue }]);
      }
    }
  };

  const handleNewHourConfirm = (event, selectedDate) => {
    if (selectedDate) {
      const newHourId = hours.length > 0 ? hours[hours.length - 1].id + 1 : 1;
      const newHour = {
        id: newHourId,
        time: selectedDate,
      };
      setHours([...hours, newHour]);
      setIsSelectingNewHour(false); // Close the picker
    } else {
      setIsSelectingNewHour(false);
    }
  };

  const deleteHour = (index) => {
    const newHours = [...hours];
    const newShowPicker = [...showPicker];
    newHours.splice(index, 1);
    newShowPicker.splice(index, 1);
    setHours(newHours);
    setShowPicker(newShowPicker);
  };

  const submitRoutine = async () => {
    setLoading(true);
    setMessage('');
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        const payload = {
          selectedDays: selectedDays.map(day => day.day),
          hours: hours.map(hour => ({ id: hour.id, time: hour.time.toISOString() })),
          user_token: userToken,
        };
        await axios.post(Config.API_URL +'/setroutine', payload);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.title}>Select Days</Text>
      <View style={styles.daysRow}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day.value}
            onPress={() => handleDayToggle(day.value)}
            style={selectedDays.some(selectedDay => selectedDay.day === day.value) ? styles.dayButtonSelected : styles.dayButton}
          >
            <Text style={selectedDays.some(selectedDay => selectedDay.day === day.value) ? styles.dayTextSelected : styles.dayText}>
              {day.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  
      <Text style={styles.title}>Select Hours</Text>
      {hours.map((hourObj, index) => (
        <View key={hourObj.id} style={styles.hourRow}>
          <Text style={styles.hourText}>Hour: {hourObj.time.toLocaleTimeString()}</Text>
          <TouchableOpacity onPress={() => deleteHour(index)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{marginTop: 10}}></View>
      <Button onPress={() => setIsSelectingNewHour(true)} title="Add Hour" disabled={hours.length >= 20 || isSelectingNewHour} />
      
      {isSelectingNewHour && (
        <DateTimePicker
          value={newHourTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            handleNewHourConfirm(event, selectedDate);
            setIsSelectingNewHour(false); // Close picker after selection
          }}
          onTouchCancel={() => setIsSelectingNewHour(false)} // Optional: Close picker if cancelled
        />
      )}
      
      {/* Spacer View to ensure margin at the bottom */}
      <View style={{marginTop: 10}}></View>
      
      <Button style={styles.submitButton} onPress={submitRoutine} title="Submit" disabled={loading} />
      {message ? <Text>{message}</Text> : null}
      <View style={{paddingBottom: 50}}></View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 20, // This ensures padding at the bottom
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hourText: {
    flex: 14,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    marginBottom: 20,
  }
});

export default RoutineManager;
