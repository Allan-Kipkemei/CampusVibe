import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar} from 'react-native';
import Billing from '../components/Billing';
import { useFocusEffect } from '@react-navigation/native';


const packages = [
  {productId: 'freemium', name: "Freemium", price: 0 },
  {productId: 'business', name: "Business & Marketing", price: 4.99 },
  {productId: 'portfolio', name: "Personal Portfolio", price: 9.99 },
  {productId: 'combined', name: "Combined", price:10.99 },
];

const CreateProfessionalAccount = () => {
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);

  return (
    <ScrollView style={styles.container}showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
      <Text style={styles.headerText}>Select a package:</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {packages.map((p, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedPackage(p)} 
            style={{
              backgroundColor: p.name === selectedPackage.name ? '#44bcd8' : 'white',
              borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 10,
              marginRight: 10, paddingHorizontal: 20, paddingVertical: 40
            }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: p.name === selectedPackage.name ? 'white' : 'black' }}>{p.name}</Text>
            <Text style={{color: p.name === selectedPackage.name ? 'white' : 'black'}}>{p.price === 0 ? 'Free' : `$${p.price}`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.package}>
         <Text style={styles.packagename}>Package Details:</Text>
         <Text style={styles.packagetext}>{selectedPackage.name}</Text>
         <Text style={styles.packagetext}>{selectedPackage.price === 0 ? 'Free' : `$${selectedPackage.price}`}</Text>
         <Text style={styles.packagetext}>Loreommodo consequat. Nulla quis consequat </Text>
      </View>

      <Billing amount={selectedPackage.price} productId={selectedPackage.productId}/>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container:{
    paddingBottom: 200 
  },
   headerText:{
    fontSize: 16, paddingVertical: 20, marginLeft: 20, fontWeight: '500',
    },
    scroll:{
      width: '100%', marginLeft: 10
    },
    package:{
       borderWidth: 1, borderColor: '#e0e0e0', 
       padding: 20, borderRadius: 10, marginVertical: 40 ,
       width: '90%', alignSelf: 'center'
      },
      packagename:{
        fontWeight: '500', fontSize: 15,
      }


});
export default CreateProfessionalAccount;
