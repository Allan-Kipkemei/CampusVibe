import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { useSelector } from "react-redux";

const ProfessionalPortfolio = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Avatar.Image size={60} source={{uri: userProfile.profileImage}} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{userProfile.username}</Text>
          <Text style={styles.subtitle}>Enthusiast / enterprenuer</Text>
          <View style={styles.buttons}>
            <Button mode="contained" style={styles.editButton}>
              Edit Profile
            </Button>
            <Button mode="outlined" style={styles.connectButton}>
              Connect
            </Button>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <Card style={styles.card}>
          <Card.Title title="Projects" />
          <Card.Content>
            <Paragraph>
              Here you can showcase some of your projects, add images and
              descriptions.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" style={styles.cardButton}>
              View All
            </Button>
            <Button mode="text" style={styles.cardButton}>
              Add Project
            </Button>
          </Card.Actions>
        </Card>
        <Card style={styles.card}>
          <Card.Title title="Network" />
          <Card.Content>
            <Paragraph>
              Here you can connect with other professionals and explore job
              opportunities.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" style={styles.cardButton}>
              View All
            </Button>
            <Button mode="text" style={styles.cardButton}>
              Connect
            </Button>
          </Card.Actions>
        </Card>
        <Card style={styles.card}>
          <Card.Title title="Posts" />
          <Card.Content>
            <Paragraph>
              Here you can post about your work, interests, and network with
              other professionals.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" style={styles.cardButton}>
              View All
            </Button>
            <Button mode="text" style={styles.cardButton}>
              Create Post
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
  },
  connectButton: {
    backgroundColor: "white",
    borderColor: "#0984e3",
    borderWidth: 1,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  cardButton: {
    fontWeight: "bold",
  },
});

export default ProfessionalPortfolio;
