import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const topics = [
  { id: 'trending', label: 'Trending', icon: 'trending-up', iconSet: 'Feather' },
  { id: 'money', label: 'Money', icon: 'dollar-sign', iconSet: 'Feather' },
  { id: 'love', label: 'Love', icon: 'heart', iconSet: 'Feather' },
  { id: 'education', label: 'Education', icon: 'book', iconSet: 'Feather' },
  { id: 'life', label: 'Life', icon: 'heart-outline', iconSet: 'Ionicons' },
  { id: 'share_love', label: 'Share Love', icon: 'share', iconSet: 'Feather' },
  // Add more topics here
];

const TopicItem = ({ topic, selected, onSelect }) => {
  const IconComponent = topic.iconSet === 'Feather' ? Feather : Ionicons;

  return (
    <TouchableOpacity
      style={[styles.topicItem, selected && styles.selectedItem]}
      onPress={() => onSelect(topic.id)}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, selected && styles.selectedIconCircle]}>
          <IconComponent name={topic.icon} size={24} color={selected ? '#fff' : '#000'} />
        </View>
      </View>
      <Text style={[styles.topicLabel, selected && styles.selectedLabel]}>{topic.label}</Text>
    </TouchableOpacity>
  );
};

const TopicPicker = ({ selectedTopic, onTopicSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a vibe:</Text>
      <FlatList
        data={topics}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TopicItem
            topic={item}
            selected={selectedTopic === item.id}
            onSelect={onTopicSelect}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 8,
  },
  topicItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedItem: {
    borderBottomColor: '#2696b8',
    borderBottomWidth: 2,
  },
  iconContainer: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: '#2696b8',
    padding: 5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconCircle: {
    backgroundColor: '#2696b8',
  },
  topicLabel: {
    color: '#707070',
  },
  selectedLabel: {
    color: '#2696b8',
  },
});

export default TopicPicker;
