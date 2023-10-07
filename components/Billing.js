import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


const Billing = ({ amount, productId }) => {
  const navigation = useNavigation();
  const [paymentMode, setPaymentMode] = useState('yearly');
  const userId = useSelector((state => state.userProfile.userId))
  const [currency, setCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const paymentMethods = [
    { name: 'Mpesa', image: require('../assets/mpesa.png') },
    { name: 'Visa', image: require('../assets/visa.png') },
    { name: 'Paypal', image: require('../assets/paypal.png') },
  ];
 

 const handlePaymentModeChange = (mode) => {
  setPaymentMode(mode);
};

const handleCurrencyChange = (newCurrency) => {
  setCurrency(newCurrency);
  if (newCurrency === 'KES') {
    setConvertedAmount((amount * 130).toFixed(2));
  } else {
    setConvertedAmount((amount / 130).toFixed(2));
  }
};
useEffect(() => {
  let convertedAmount;
  if (paymentMode === 'yearly') {convertedAmount = (amount * 12 * 0.8);
  } else if (paymentMode === 'monthly') {convertedAmount = amount;}
  
  if (currency === 'KES') {convertedAmount *= 130;
  } else {convertedAmount; }
  
  setConvertedAmount(convertedAmount.toFixed(2));
}, [paymentMode, currency, amount]);


const displayAmount = paymentMode === 'yearly' ? (convertedAmount * 0.8).toFixed(2) : convertedAmount;

  const handleContinuePress = () => {
    const price = displayAmount;
    if (displayAmount > 0) {
      navigation.navigate('Payment', {
        userId: userId,
        productId: productId,
        paymentMode: paymentMode,
        currency: currency,
        price: price,
        paymentMethod: paymentMethod
      });
      
    } else {
      // Redirect to account upgrade page
      navigation.navigate('AccountUpgrade',{
        userId: userId,
        productId: productId,
        paymentMode: paymentMode,
        currency: currency,
        price: price,
        paymentMethod: paymentMethod
      } );
    }
  };
  


  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.title}>Total Amount:</Text>
        <View style={styles.amountDetails}>
          <Text style={styles.amountValue}>
            {displayAmount} {currency}
          </Text>
          <TouchableOpacity
            style={styles.currencyButton}
            onPress={() => handleCurrencyChange(currency === 'KES' ? 'USD' : 'KES')}>
            <Text style={styles.currencyButtonText}>
              Convert {currency === 'KES' ? 'USD' : 'KES'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.paymentModeContainer}>
        <Text style={styles.title}>Select Payment Mode:</Text>
        <View style={styles.paymentModeButtons}>
          <TouchableOpacity
            style={[styles.paymentModeButton,paymentMode === 'yearly' ? styles.activePaymentModeButton : null, ]}
            onPress={() => handlePaymentModeChange('yearly')}>
            <Text style={[styles.paymentModeButtonText, paymentMode === 'yearly' ? styles.activePaymentModeText : null]}>Yearly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentModeButton,paymentMode === 'monthly' ? styles.activePaymentModeButton : null,]}
              onPress={() => handlePaymentModeChange('monthly')}>
            <Text style={[styles.paymentModeButtonText, paymentMode === 'monthly' ? styles.activePaymentModeText : null]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.paymentMethodContainer}>
      <Text style={styles.title}>Select Payment Method:</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.name}
            style={styles.paymentMethodButton}
            onPress={() => setPaymentMethod(method.name)}
            >
            <Image style={styles.paymentMethodImage} source={method.image} />
            <Text style={styles.paymentMethodButtonText}>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.continuebutton} onPress={() => handleContinuePress()} >
          <Text style={styles.continuetext}>Continue to Payment</Text>
       </TouchableOpacity>
    </View>
    </View>
  );
};





const styles = StyleSheet.create({

  container:{
    // borderWidth: 1, border
    width: '90%',
    alignSelf: 'center'
  },
  amountContainer:{
   
  },
  title: {
    fontWeight: '500', fontSize: 15,  paddingVertical: 10
  },
  amountDetails:{
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 10,
  },
  currencyButton:{
    width: 100, height: 30, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 20 
  },
  currencyButtonText:{
   color: '#a0a0a0'
  },
  amountValue:{
    fontSize: 17
  },
  paymentModeContainer:{
    // borderWidth: 1,marginVertical: 10
  },
  paymentModeButtons:{
    
  },
  paymentModeButton:{
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 20,
    alignItems: 'center', paddingVertical: 10, marginBottom: 5
  },
  activePaymentModeButton:{
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 20,
    backgroundColor: '#44bcd8',
    alignItems: 'center', paddingVertical: 10
  },
  activePaymentModeText:{
    color: 'white'
  },

  paymentMethodContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentMethodButton: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1, borderColor: '#e0e0e0', 
    padding: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  paymentMethodImage: {
    width: 30,
    height: 30, 
    marginRight: 10,
  },
  paymentMethodButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continuebutton:{
    borderRadius: 20,
    backgroundColor: '#44bcd8',
    alignItems: 'center', paddingVertical: 10,
    marginVertical: 40
  },
  continuetext:{
    color: 'white'
  },

})
export default Billing;
