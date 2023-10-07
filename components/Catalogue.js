import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { db, app} from '../firebase/firebase';
import { doc, getDoc, updateDoc} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

const placeholderImage = 'https://via.placeholder.com/1000';
// const userId = useSelector((state => state.userProfile.userId))

const ProductEditing = ({ product, handleUpdateProduct, handleSaveProduct, handleCancelProduct, handleDeleteProduct, sloading, dloading }) => {
  
  const handleSelectImage = async() => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      handleUpdateProduct('image', result.uri);
    }
  };

  

  
  return (
    <View style={styles.holder}>
      <TouchableOpacity onPress={handleSelectImage} style={styles.select}>
        <Image
          source={product.image ? { uri: product.image } : { uri: placeholderImage }}
          style={{ width: '100%', height: 150, borderRadius: 5}}
        />
      </TouchableOpacity>
      <TextInput
      placeholder='Product name'
        style={styles.input}
        value={product.name}
        onChangeText={(text) => handleUpdateProduct('name', text)}
      />
      <TextInput
           placeholder='price'
           style={styles.input}
           value={product.price}
           onChangeText={(text) => handleUpdateProduct('price', text)}
           keyboardType="numeric"
       />

      <TextInput
        placeholder='Product description'
        style={styles.input}
        value={product.description}
        onChangeText={(text) => handleUpdateProduct('description', text)}
      />
   <View style={styles.buttonsContainer}>
  <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
    <Text style={styles.buttonText}>Save</Text>
    {sloading && (
      <ActivityIndicator size={'small'} color={'#2696b8'}/>
    )}
  </TouchableOpacity>
  {product.name && (  
    <TouchableOpacity style={styles.button} onPress={handleDeleteProduct}>
      <Text style={styles.buttonText}>Delete</Text>
      {dloading && (
        <ActivityIndicator size={'small'} color={'#2696b8'}/>
      )}
    </TouchableOpacity>
  )}
  <TouchableOpacity style={styles.button} onPress={handleCancelProduct}>
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>
</View>

    </View>
  );
};

const Catalogue = ({tuserId}) => {
  const userId = useSelector((state => state.userProfile.userId))
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false); // New state variable to track updates
  const [sloading, setSLoading] = useState(false);
  const [dloading, setDLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const productsRef = doc(db, 'userProfiles', userId, 'professional', 'business');
        const productsDoc = await getDoc(productsRef);
  
        if (productsDoc.exists()) {
          const productsData = productsDoc.data();
          const products = productsData.catalogue || [];
          setProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Handle the error here, for example, by setting an error state or showing an error message.
      }
    };
    setIsLoading(false)
    fetchProducts();
  }, []);
  
  const [newProduct, setNewProduct] = useState({
    id: null,
    image: '',
    name: '',
    price: '',
    description: ''
  });

  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const handleUpdateProduct = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      alert('Please fill in all fields');
    } else {
      let updatedProducts;
      // Upload catalogue image
      const handleImageUpload = async (getImage) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/catalogue/${Date.now()}_${getImage}`);
  
        // Fetch image data
        const response = await fetch(getImage);
        const blob = await response.blob();
  
        // Upload image data to Firebase Storage
        const uploadTask = uploadBytes(storageRef, blob);
        await uploadTask;
  
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      };
  
      let newImage = '';
      const getImage = newProduct.image;
      
      if (newProduct.image && selectedProductIndex !== null && newProduct.image !== products[selectedProductIndex]?.image) {
        newImage = await handleImageUpload(getImage);
      } else {
        newImage = selectedProductIndex !== null ? products[selectedProductIndex]?.image : '';
      }
      
  
      // Create a new product object with the updated image URL
      const updatedProduct = {
        ...newProduct,
        image: newImage,
      };
  
      if (selectedProductIndex !== null) {
        // Update existing product
        updatedProducts = [...products];
        updatedProducts[selectedProductIndex] = updatedProduct;
      } else {
        // Add new product
        const id = Date.now().toString(); // Generate a unique id using Date.now()
        const newProductWithId = { ...updatedProduct, id };
        updatedProducts = [...products, newProductWithId];
      }
  
      setSLoading(true);
      try {
        const productsRef = doc(db, 'userProfiles', userId, 'professional', 'business');
        await updateDoc(productsRef, { catalogue: updatedProducts });
        setProducts(updatedProducts);
        handleCancelProduct(); // Close the modal
      } catch (error) {
        console.error('Error updating product catalog:', error);
        // Handle the error here, for example, by setting an error state or showing an error message.
      }
      setSLoading(false);
    }
  };
  
  
  

  const handleCancelProduct = () => {
    setNewProduct({ id: null, image: '', name: '', price: '', description: '' });
    setSelectedProductIndex(null);
  };

  const handleDeleteProduct = async () => {
    const updatedProducts = [...products];
    updatedProducts.splice(selectedProductIndex, 1);
    setProducts(updatedProducts);
  
    try {
      setDLoading(true)
      const productsRef = doc(db, 'userProfiles', userId, 'professional', 'business');
      await updateDoc(productsRef, { catalogue: updatedProducts });
      console.log('Product catalog updated in the database');
    } catch (error) {
      console.error('Error updating product catalog:', error);
      // Handle the error here, for example, by setting an error state or showing an error message.
    }
    setDLoading(false)
    handleCancelProduct()
  };
  

  const handleEditProduct = (index) => {
    const selectedProduct = products[index];
    setNewProduct(selectedProduct);
    setSelectedProductIndex(index);
  };
  
  
  return (
    <View style={styles.container}>
      {selectedProductIndex !== null ? (
        <ProductEditing
          product={newProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleSaveProduct={handleSaveProduct}
          handleCancelProduct={handleCancelProduct}
          handleDeleteProduct={handleDeleteProduct}
          sloading={sloading}
          dloading={dloading}
        />
      ) : (
        <>
          {products.length === 0 && (
            <Text style={styles.crt}>Add products to your catalogue for easier access by your customers</Text>
          )}
  
          {products.map((product, index) => (
            <TouchableOpacity
              key={product.name}
              style={styles.card}
              onPress={() => handleEditProduct(index)}
            >
              <Image
                source={product.image ? { uri: product.image } : { uri: placeholderImage }}
                style={styles.image}
              />
              <View style={styles.cardText}>
                <Text style={styles.not}>{product.name}</Text>
                <Text style={styles.crt}>Kshs. {product.price}</Text>
                <Text style={styles.crt}>{product.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedProductIndex(products.length)}
          >
            <FontAwesome name="edit" size={35} color="#707070" />
            <View style={styles.cardText}>
              <Text style={styles.crt}>Add new product</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginVertical: 10,
  },
  cardText: {
    marginLeft: 10
  },
  crt: {
    color: '#707070'
  },
  holder: {
    borderWidth: 1,borderColor: '#f0f0f0', borderRadius: 5,
    padding:5,
    paddingBottom: 30,
    backgroundColor: '#ffff',
  },
  select: {
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 5
  },
  buttonText: {
    fontSize: 16
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1
  },
  container:{
    // borderWidth: 1,
    marginBottom: 50,
  }
});

export default Catalogue;
