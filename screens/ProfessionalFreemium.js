import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const portfolio = {
  name: "John Doe",
  contactDetails: "johndoe@example.com | 123-456-7890",
  aboutMe: "Hi, I'm John Doe, a software engineer with 5+ years of experience...",
  skills: "JavaScript, React, Node.js, HTML, CSS",
  projects: [
    {
      title: "Project 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum, enim vitae malesuada imperdiet, ipsum eros mollis lacus, a vestibulum enim libero et odio."
    },
    {
      title: "Project 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum, enim vitae malesuada imperdiet, ipsum eros mollis lacus, a vestibulum enim libero et odio."
    },
    {
      title: "Project 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum, enim vitae malesuada imperdiet, ipsum eros mollis lacus, a vestibulum enim libero et odio."
    },
  ],
};

const ProfessionalFreemium = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{portfolio.name}</Text>
        <Text style={styles.contactText}>{portfolio.contactDetails}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.sectionHeader}>About Me</Text>
        <Text style={styles.text}>{portfolio.aboutMe}</Text>
        <Text style={styles.sectionHeader}>Skills</Text>
        <Text style={styles.text}>{portfolio.skills}</Text>
        <Text style={styles.sectionHeader}>Projects</Text>
        <View style={styles.projects}>
          {portfolio.projects.map((project, index) => (
            <View style={styles.project} key={index}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectDescription}>{project.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
  },
  body: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  projects: {
    marginTop: 10,
  },
  project: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
  },
});

export default ProfessionalFreemium;
