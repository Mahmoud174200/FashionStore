// import React, { useState, useEffect } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   Image,
//   Pressable,
//   Modal,
//   StyleSheet,
//   Text,
//   FlatList,
// } from "react-native";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import {
//   subscribe,
//   getAllProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } from "../firebase/products";
// import * as ImagePicker from "expo-image-picker";

// const AddProductWithPhoto = () => {
//   const [productName, setProductName] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [productPhoto, setProductPhoto] = useState(null);
//   const [products, setProducts] = useState([]);
//   const getProductsList = async () => {
//     const c = await getAllProducts();
//     setProducts(c);
//     console.log("products", c);
//   };
//   useEffect(() => {
//     const unsubscribe = subscribe(({ change, snapshot }) => {
//       //   console.log("changes", change, snapshot, change.type);
//       // if (snapshot.metadata.hasPendingWrites) {
//       if (change.type === "added") {
//         console.log("New Product: ", change.doc.data());
//         getProductsList();
//       }
//       if (change.type === "modified") {
//         console.log("Modified Product: ", change.doc.data());
//         getProductsList();
//       }
//       if (change.type === "removed") {
//         console.log("Removed  Product: ", change.doc.data());
//         getProductsList();
//       }
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, []);
//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
  
//     console.log(result);
  
//     if (!result.canceled) {
//       setProductPhoto(result.assets[0].uri);
//     }
//   };
  
//   const handleAddProduct = async () => {
//     try {
//       if (!productName || !productPrice || !productPhoto) {
//         Alert.alert("Error", "Please fill in all fields.");
//         return;
//       }
  
//       const storage = getStorage();
//       const photoRef = ref(
//         storage,
//         `products/${Date.now()}_${productPhoto.name}`
//       );
//       await uploadBytes(photoRef, productPhoto);
  
//       const photoURL = await getDownloadURL(photoRef);
  
//       const firestore = getFirestore();
//       const productsCollection = collection(firestore, "products");
//       const newProduct = {
//         name: productName,
//         price: parseFloat(productPrice),
//         photoURL: photoURL,
//       };
//       await addDoc(productsCollection, newProduct);
//       Alert.alert("Success", "Product added successfully.");
//       setProductName("");
//       setProductPrice("");
//       setProductPhoto(null);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       Alert.alert("Error", "Failed to add product. Please try again.");
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Products</Text>
//       <View style={styles.formContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Product Name"
//           value={productName}
//           onChangeText={(text) => setProductName(text)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Product Price"
//           keyboardType="numeric"
//           value={productPrice}
//           onChangeText={(text) => setProductPrice(text)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Product Url"
//           keyboardType="numeric"
//           value={productPhoto}
//           onChangeText={(text) => setProductPhoto(text)}
//         />
//         <Pressable style={styles.button} onPress={pickImage}>
//           <Text style={styles.buttonText}> or Update PHoto</Text>
//         </Pressable>
//         <Pressable style={styles.button} onPress={handleAddProduct}>
//           <Text style={styles.buttonText}>Add Product</Text>
//         </Pressable>
//       </View>
//       <View style={styles.flatListContainer}>
//         <FlatList
//           data={products}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.productItem}>
//               <Text>{item.name}</Text>
//               <Text>{item.price}</Text>
//               <Image
//                 source={{ uri: item.photoURL }}
//                 style={{
//                   width: 50,
//                   height: 50,
//                   marginVertical: 10,
//                 }}
//               />
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   formContainer: {
//     width: "80%",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#264143",
//     paddingVertical: 12,
//     borderRadius: 5,
//     alignItems: "center",
//     width: "60%",
//     margin: "1%",
//     alignSelf: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   flatListContainer: {
//     flex: 1,
//     width: "80%",
//     marginTop: 20,
//   },
//   productItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   editButton: {
//     color: "blue",
//   },
//   deleteButton: {
//     color: "red",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     width: "80%",
//   },
// });

// export default AddProductWithPhoto;
