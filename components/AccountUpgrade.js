import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import { useNavigation, CommonActions} from '@react-navigation/native';


const AccountUpgrade = ({ route }) => {
    const navigation = useNavigation();
    const { userId, productId, paymentMode, currency, price, paymentMethod } = route.params;
    const handleUpgradePress = () => {
        Linking.openURL(`https://www.vibe.com/pay?user_id=${userId}&product_id=${productId}&payment_mode=${paymentMode}&currency=${currency}&price=${price}&package=freemium}`, {
          onClose: handleCancel
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
      <Text style={styles.title}>Account Upgrade</Text>
      <Text style={styles.text}>Your account will be upgraded to the freemium professional package.</Text>

      <View style={styles.buttons}>
         <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradePress}>
             <Text style={styles.buttonText}>Upgrade</Text>
           </TouchableOpacity>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleCancel}>
             <Text style={styles.buttonText}>Cancel</Text>
           </TouchableOpacity>
      </View>
    </View>
  );

};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      marginHorizontal: 40,
    },
    upgradeButton: {
      backgroundColor: '#44bcd8',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttons:{
        flexDirection: 'row', justifyContent: 'space-between',
        width: '60%'
    }
  });
  
export default AccountUpgrade;
