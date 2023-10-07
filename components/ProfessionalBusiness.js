import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TextInput} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import Catalogue from "./Catalogue";

const {width, height} = Dimensions.get('window');


const ProfessionalBusiness = ({ subscription }) => {
  const [activeTab, setActiveTab] = useState("catalogue");
  const userProfile = useSelector((state => state.userProfile))
  const userId = userProfile.userId;
  const [loading, setLoading] = useState(false)

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };


  // fuctions
  const [businessData, setBusinessData] = useState({
    businessName: '',
    contact: '',
    category: '',
})
useEffect(() => {
  const fetchBusinessDetails = async () => {
    setLoading(true);
    try {
      const businessDetailsRef = doc(db, 'userProfiles', userId, 'professional', 'business');
      const businessDetailsDoc = await getDoc(businessDetailsRef);

      if (businessDetailsDoc.exists()) {
        const businessDetailsData = businessDetailsDoc.data();
        const { businessName, contact, category } = businessDetailsData.businessDetails || {};

        setBusinessData({
          businessName: businessName || '',
          contact: contact || '',
          category: category || '',
        });
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
    }

    setLoading(false);
  };

  fetchBusinessDetails();
}, []);


// edit changes
const [newBusinessData, setNewBusinessData] = useState({
  businessName: businessData.businessName,
  category: businessData.category,
  contact: businessData.contact,
});

const [businessDetailsChanges, setBusinessDetailsChanges] = useState(false);
const handleBusinessDataChange = (field, value) => {
  setBusinessDetailsChanges(true)
  setNewBusinessData((prevBusinessData) => ({
    ...prevBusinessData,
    [field]: value,
  }));
};



const handleSaveChanges = async () => {
  const updatedBusinessData = {
    businessName: newBusinessData.businessName || businessData.businessName,
    contact: newBusinessData.contact || businessData.contact,
    category: newBusinessData.category || businessData.category
  };

  try {
    const businessDetailsRef = doc(db, 'userProfiles', userId, 'professional', 'business');
    await updateDoc(businessDetailsRef, { businessDetails: updatedBusinessData });
    console.log('Business details updated in the database');
    setBusinessData(updatedBusinessData);
    setNewBusinessData({});
  } catch (error) {
    console.error('Error updating business details:', error);
    // Handle the error here, for example, by setting an error state or showing an error message.
  }
};



const handleDiscardChanges = () => {
  setNewBusinessData({
    businessName: '',
    contact: '',
    category: '',
  });
  setBusinessDetailsChanges(false);
};


  return (
    <ScrollView style={styles.container}>
      <Text>My business</Text>
      <View style={styles.header}>
        <Text style={[styles.text,styles.businessName]}>{businessData.businessName}</Text>
        <Text style={[styles.text , styles.contacts]}>{businessData.contact}</Text>
        <Text style={[styles.text, styles.type]}>{businessData.category}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuItem,activeTab === "catalogue" && styles.activeMenuItem]}
          onPress={() => handleTabChange("catalogue")}
         >
          <Text style={[styles.menuText, activeTab === "catalogue" && styles.activeText]}>Catalogue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem,activeTab === "analytics" && styles.activeMenuItem,]}
          onPress={() => handleTabChange("analytics")}
         >
          <Text style={[styles.menuText, activeTab === "analytics" && styles.activeText]}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem,activeTab === "advertising" && styles.activeMenuItem]}
          onPress={() => handleTabChange("advertising")}
         >
          <Text style={[styles.menuText, activeTab === "advertising" && styles.activeText]}>Advertising</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem,activeTab === "edit" && styles.activeMenuItem]}
          onPress={() => handleTabChange("edit")}
         >
          <Text style={[styles.menuText, activeTab === "edit" && styles.activeText]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "catalogue" && (
        <View style={styles.content}>
          <Text style={styles.headerText}>Catalogue</Text>
          <Catalogue />
        </View>
      )}

      {activeTab === "analytics" && (
        <View style={styles.content}>
          <Text style={styles.headerText}>Analytics</Text>
          <Text style={styles.normalText}>View analytics of your posts and products to track engagement and sales</Text>
        </View>
      )}

      {activeTab === "advertising" && (
        <View style={styles.content}>
          <Text style={styles.headerText}>Advertising</Text>
          <Text style={styles.normalText}>Create custom adverts to promote your business and reach more potential customers</Text>
        </View>
      )}

{activeTab === 'edit' && (
  <View style={styles.content}>
    <Text style={styles.headerText}>Edit</Text>

    <Picker
      selectedValue={newBusinessData.category}
      style={styles.picker}
      onValueChange={(itemValue) => handleBusinessDataChange('category', itemValue)}
    >
      <Picker.Item label={businessData.category} value={newBusinessData.category} />
      <Picker.Item label="Category 1" value="category1" />
      <Picker.Item label="Category 2" value="category2" />
      <Picker.Item label="Category 3" value="category3" />
    </Picker>

    <TextInput
      style={styles.input}
      placeholder={businessData.businessName}
      value={newBusinessData.businessName}
      onChangeText={(text) => handleBusinessDataChange('businessName', text)}
    />

    <TextInput
       style={styles.input}
       keyboardType="phone-pad"
       placeholder={businessData.contact}
       value={newBusinessData.contact || ''}
       onChangeText={(number) => handleBusinessDataChange('contact', number)}
     />

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Connect Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Connect Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
        disabled={!businessDetailsChanges}
       >
        <Text style={styles.savetext}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.discardButton}
        onPress={handleDiscardChanges}
        disabled={!businessDetailsChanges}
      >
        <Text style={styles.discardButtonText}>Discard Changes</Text>
      </TouchableOpacity>
    </View>
    </View>
)}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15, paddingBottom: 50
  },
  header: {
    marginVertical: 5,
    borderWidth: 1, borderRadius: 15, borderColor: '#d0d0d0',
    alignItems: 'center', justifyContent: 'center',
    height: height * 0.2,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  type:{
    color: '#a0a0a0'
  },
  menu: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  menuItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  activeMenuItem: {
    backgroundColor: "#ff8c00",
  },
  menuText: {
    fontWeight: '500'
  },
  activeText:{
    color: 'white'
  },
  content: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  normalText: {
    fontSize: 14,
  },
  text:{
    marginVertical: 5
  },

  input:{
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderColor: '#e0e0e0', 
    borderRadius:5
  },
  buttonContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop:50, marginHorizontal: 20
  },
  saveButton:{
    paddingHorizontal: 20,paddingVertical:10,
    backgroundColor: 'orange',
    borderRadius: 5
  },
  discardButton:{
    paddingHorizontal: 20,paddingVertical:10,
     borderWidth: 1,
    borderRadius: 5, borderColor: '#e0e0e0'
  },
  savetext:{
    color:'white'
  },
  socialButtons:{
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  socialButton: {
    padding:10,
    borderWidth: 1,borderColor: '#e0e0e0',
    flex:1
  },
  picker:{
    
  }
});

export default ProfessionalBusiness;
