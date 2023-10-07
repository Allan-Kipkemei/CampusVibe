import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';



const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const StudentNotProfessional = ({ onCreateProfessionalAccount }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const defaultProfileImage = require('../assets/graduate.png')
    const profileImage  = useSelector((state => state.userProfile.profileImage))
  const navigation = useNavigation()
    const slides = [
      {
        title: "Build Your Online Portfolio",
        description: "Create a professional online portfolio that showcases your skills and projects.",
        image: require('../assets/studentPortfolio.png'),
      },
      {
          title: "Are you interested in starting a side hustle or small business? ",
          description: "Create a business catalogue and market your products to a wider audience. Turn your passion into profit.",
          image: require('../assets/studentHustle.png'),
        },
      {
        title: "Connect with Professionals",
        description: "Connect with industry professionals and expand your network.",
        image: require('../assets/studentConnect.png'),
      },
      {
        title: "Get Noticed by Employers",
        description: "Stand out from the crowd and increase your chances of getting hired.",
        image: require('../assets/studentJob.png'),
      },
      {
        title: "Upgrade to a Professional Account",
        description: "Create a professional account to access premium features and unlock your full potential.",
        image: {uri: profileImage} || defaultProfileImage,
      },
    ];
  
    const handleNextSlide = () => {
      if (slideIndex < slides.length - 1) {
        setSlideIndex(slideIndex + 1);
      } else {
        onCreateProfessionalAccount();
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.slide}>
          <Image
            source={slides[slideIndex].image} 
            style={[styles.image, slideIndex === slides.length - 1 ? styles.lastImage : null]}
          />
          <Text style={styles.title}>{slides[slideIndex].title}</Text>
          <Text style={styles.description}>{slides[slideIndex].description}</Text>
        </View>
        
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                slideIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
    
        <View style={styles.buttonsContainer}>
          {slideIndex === slides.length - 1 ? (
            <TouchableOpacity style={styles.createAccountButton} onPress={onCreateProfessionalAccount}>
              <Text style={styles.nextButtonText}>Create Professional Account  </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.skipButton} onPress={() => setSlideIndex(slides.length - 1)}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextSlide}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  slide: {
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
    marginBottom: 50,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  skipButtonText: {
    color: 'white'
  },
  nextButton: {
    backgroundColor: 'rgba(38,150,184, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    color: 'white'
  },
  lastImage:{
    width: 150, height: 150,
    borderRadius: 100, 
},
dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute', bottom: 200
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    borderWidth: 1, borderColor: '#404040',
    marginHorizontal: 5,
  },
  activeDot: {
    borderWidth: 1, borderColor: '#404040',
    backgroundColor: '#404040'
  },
  createAccountButton: {
    backgroundColor: 'rgba(38, 150, 184, 0.5)',
    borderRadius: 50, padding: 15, 
    // position: 'absolute', 
    left: 40, right: 40, alignItems: 'center'
  }
  
  
});

export default StudentNotProfessional;
