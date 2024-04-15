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

const frequencies = [
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
];

const RoutineManager = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [hours, setHours] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState(frequencies[0].value); // Default frequency
  const [isSelectingStartTime, setIsSelectingStartTime] = useState(false);
  const [isSelectingEndTime, setIsSelectingEndTime] = useState(false);
  const [isSelectingNewHour, setIsSelectingNewHour] = useState(false);
  const [showHours, setShowHours] = useState(false); // Step 1: New state variable for controlling visibility
  const toggleHoursVisibility = () => {
    setShowHours(!showHours);
  };
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(8, 0, 0, 0); // Example: setting start time to 8:00 AM today, local time
    return now;
  });
  
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setHours(17, 0, 0, 0); // Example: setting end time to 5:00 PM today, local time
    return now;
  });

  const handleFrequencySelect = (frequencyValue) => {
    setSelectedFrequency(frequencyValue);
  };

  const generateTimes = () => {
    let generatedTimes = [];
    console.log('Selected start time:', startTime);
    let currentTime = new Date(startTime.getTime());
    const endTimeValue = endTime.getTime();

    while (currentTime.getTime() + selectedFrequency * 60000 <= endTimeValue) {
      generatedTimes.push({
        id: generatedTimes.length + 1, // Consider using a more robust method for IDs
        time: new Date(currentTime.getTime()),
      });
      currentTime.setMinutes(currentTime.getMinutes() + selectedFrequency);
    }
    setHours(generatedTimes);
};

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
          hours: hours.map(hour => ({
            id: hour.id,
            time: hour.time.toISOString(), // Convert to UTC string before sending
          })),
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
      <Text style={styles.title}>Select time range</Text>
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity onPress={() => setIsSelectingStartTime(true)} style={styles.timeButton}>
          <Text>{`Start: ${startTime.toLocaleTimeString()}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSelectingEndTime(true)} style={styles.timeButton}>
          <Text>{`End: ${endTime.toLocaleTimeString()}`}</Text>
        </TouchableOpacity>
      </View>

      {isSelectingStartTime && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setStartTime(selectedDate || startTime);
            setIsSelectingStartTime(false);
          }}
        />
      )}

      {isSelectingEndTime && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setEndTime(selectedDate || endTime);
            setIsSelectingEndTime(false);
          }}
        />
      )}

      {/* JSX for selecting frequency */}
      <Text style={styles.title}>Select Frequency</Text>
      <View style={styles.frequencyContainer}>
        {frequencies.map((freq) => (
          <TouchableOpacity
            key={freq.value}
            style={selectedFrequency === freq.value ? styles.freqButtonSelected : styles.freqButton}
            onPress={() => handleFrequencySelect(freq.value)}
          >
            <Text style={styles.freqButtonText}>{freq.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.buttonStyle} onPress={generateTimes}>
        <Text style={styles.buttonText}>Generate Times</Text>
      </TouchableOpacity>
      <View style={{marginTop: 10}}></View>
      <TouchableOpacity style={styles.buttonStyle} onPress={toggleHoursVisibility}>
        <Text style={styles.buttonText}>{showHours ? "Hide Hours" : "Show Hours"}</Text>
    </TouchableOpacity>

      {/* Step 4: Conditional Rendering for the "Selected Hours" Section */}
      {showHours && ( // This block will only render if showHours is true
        <>
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
          
          <TouchableOpacity
            onPress={() => setIsSelectingNewHour(true)}
            style={[styles.buttonStyle, (hours.length >= 100 || isSelectingNewHour) && styles.buttonDisabled]}
            disabled={hours.length >= 100 || isSelectingNewHour}
          >
            <Text style={styles.buttonText}>Add Hour</Text>
          </TouchableOpacity></>
      )}
      
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
      
      <TouchableOpacity style={styles.buttonStyle} onPress={submitRoutine} disabled={loading}>
          <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      {message ? <Text>{message}</Text> : null}
      <View style={{paddingBottom: 50}}></View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#373738', // Your desired background color
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    marginVertical: 5, // Add some vertical margin
  },
  buttonText: {
    color: '#FFF', // Text color that contrasts with the button background
    fontSize: 16, // Adjust as needed
  },
  container: {
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 20, // This ensures padding at the bottom
  },
  title: {
    fontSize: 18,
    marginTop:15,
    fontFamily: 'Cheveuxdange',
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
    borderColor: '#373738',
    backgroundColor: '#e0f0ff',
    marginBottom: 5,
  },
  dayText: {
    textAlign: 'center',
  },
  dayTextSelected: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#373738',
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
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  freqButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  freqButtonSelected: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#373738',
    backgroundColor: '#e0f0ff',
  },
  freqButtonText: {
    textAlign: 'center',
  },
});

export default RoutineManager;
