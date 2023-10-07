import { logout } from "../src/store/store";

const dispatch = useDispatch();

const handleLogout = () => {
  dispatch(logout());
};

{/* <Topnav/> */}
<View style={styles.tab1}>
   <View style={styles.user}>
      <Image source={profileImage} style={styles.profile}/>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.field}>{field}</Text>
   </View>
   <View style={styles.followers}>

   </View>
 </View>
 <View style={styles.tab2}>
    <TouchableOpacity style={styles.editprofile} onPress={handleLogout}>
      <Text style={styles.edit}>Log out</Text>
    </TouchableOpacity>

 </View>

 {/* <AccountTabs/> */}
 user:{
   width: 100, 
   justifyContent: 'space-between', height: 110,
   marginLeft: 10, marginTop: 10,
   },
   profile:{
     width: 70, height: 70, borderRadius: 100,    
   },
   username:{
     fontWeight: 'bold', marginLeft: 5,
   }, 
   tab2:{
     padding: 10,
   },
   editprofile:{
     backgroundColor: '#2696b8', 
     padding: 10, width: 150, 
     borderRadius: 5, alignContent: 'center'
   }, 
   edit:{
     alignSelf: 'center', color: 'white',
   }