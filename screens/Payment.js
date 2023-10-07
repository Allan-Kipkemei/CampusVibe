import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Linking } from 'react-native';
import { useNavigation, CommonActions} from '@react-navigation/native';




const Payment = ({route}) => {
    const navigation = useNavigation();
    const { userId, productId, paymentMode, currency, price, paymentMethod } = route.params;
    const handleUpgradePress = () => {
        Linking.openURL(`https://www.vibe.com/pay?user_id=${userId}&product_id=${productId}&payment_mode=${paymentMode}&currency=${currency}&price=${price}&package=freemium}`, {
        onclose: handleCancel
    });
      };
      
      const handleCancel = () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'BottomTabsRoot',
              state: {
                index: 4, // Index of the Account screen in the bottom tabs
                routes: [ { name: 'Feed' },{ name: 'Clubs' },{ name: 'VirtualClassroom' }, { name: 'Inbox' },{ name: 'Account' }, ],
              },}, ],});
           }; 
      

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details:</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Pay with: <Text style={styles.text}>{paymentMethod}</Text></Text>
        <Text style={styles.detailsText}>Product ID: <Text style={styles.text}>{productId}</Text></Text>
        <Text style={styles.detailsText}>Payment Mode: <Text style={styles.text}>{paymentMode}</Text></Text>
        <Text style={styles.detailsText}>Currency: <Text style={styles.text}>{currency}</Text></Text>
        <Text style={styles.detailsText}>Price: <Text style={styles.text}>{price}</Text></Text>
      </View>
      
      <View style={styles.buttons}>
      <TouchableOpacity style={styles.paymentButton} onPress={handleUpgradePress}>
             <Text style={styles.buttonText}>Upgrade</Text>
        </TouchableOpacity>
       <TouchableOpacity style={styles.paymentButton} onPress={handleCancel}>
             <Text style={styles.buttonText}>Cancel</Text>
         </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20, 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  detailsContainer: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 20,
    marginVertical: 40,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10, fontWeight: '500'
  },
  paymentButton: {
    backgroundColor: '#44bcd8',
    borderRadius: 20,
    width: 140, height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  
  },
  buttons:{
    flexDirection: 'row', width: '90%',
    justifyContent:'space-between', alignSelf:'center',
    
  },
  text:{
    color: '#2696b8', fontWeight: '400'
  }
});

export default Payment;