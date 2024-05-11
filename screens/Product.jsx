import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  Image,
  Alert,
} from "react-native";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  subscribe,
} from "../firebase/products";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

const ProductsScreen = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProductsList = async () => {
    const c = await getAllProducts();
    setProducts(c);
    await AsyncStorage.setItem("products", JSON.stringify(c));
    if (!c) {
      const storedProducts = await AsyncStorage.getItem("products");
      setProducts(JSON.parse(storedProducts));
    }
  };

  useEffect(() => {
    const unsubscribe = subscribe(({ change, snapshot }) => {
      if (
        change.type === "added" ||
        change.type === "modified" ||
        change.type === "removed"
      ) {
        console.log(`${change.type} Product: `, change.doc.data());
        getProductsList();
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getProductsList(); // Call getProductsList to fetch initial products
  }, []);

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error Picking Image:", error);
    }
  };
  const uploadFile = async () => {
    setUploading(true);
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await fetch(uri).then((response) => response.blob());
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      setUrl(await ref.getDownloadURL());
      console.log("Download URL:", url);
      Alert.alert("Upload Completed");
      // setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };
  const handleAddProduct = async () => {
    try {
      if (!productName || !productPrice || !image) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        photoURL: url,
      };
      await createProduct(newProduct);
      Alert.alert("Success", "Product added successfully.");
      setProductName("");
      setProductPrice("");
      setImage(null);
      setUrl("");
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("An error occurred while creating the product.");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!productName || !productPrice) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      let updatedProduct = {
        name: productName,
        price: parseFloat(productPrice),
      };
      if (image) {
        setUploading(true);
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await fetch(uri).then((response) => response.blob());
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const ref = firebase.storage().ref().child(filename);
        await ref.put(blob);
        const downloadURL = await ref.getDownloadURL();
        updatedProduct.photoURL = downloadURL;
        setUploading(false);
      }
      await updateProduct(selectedProduct.id, updatedProduct);
      setEditModalVisible(false);
      setProductName("");
      setProductPrice("");
      setImage(null);
      setUrl("");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={(text) => setProductName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Price"
          keyboardType="numeric"
          value={productPrice}
          onChangeText={(text) => setProductPrice(text)}
        />
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              marginVertical: 7.5,
              left: "21%",
            }}
          />
        )}
        <Pressable style={styles.button} onPress={pickFile}>
          <Text style={styles.buttonText}> Choose Image</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={uploadFile}>
          <Text style={styles.buttonText}> Upload Image</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </Pressable>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image
                source={{ uri: item.photoURL }}
                style={styles.productImage}
              />
              <Text>{item.name}</Text>
              <Text>{item.price}</Text>
              <Pressable
                onPress={() => {
                  setSelectedProduct(item);
                  setProductName(item.name);
                  setProductPrice(item.price.toString());
                  setImage(null); // Clear image when editing
                  setUrl(item.photoURL);
                  setEditModalVisible(true);
                }}
              >
                <MaterialIcons name="edit" size={24} color="blue" />
              </Pressable>
              <Pressable onPress={() => deleteProduct(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </Pressable>
            </View>
          )}
        />
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/home/AdminBoard")}
        >
          <Text style={{ color: "white" }}>Back</Text>
        </Pressable>
      </View>
      <Modal
        visible={editModalVisible}
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={(text) => setProductName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Product Price"
              keyboardType="numeric"
              value={productPrice}
              onChangeText={(text) => setProductPrice(text)}
            />
            <Pressable
              style={styles.button}
              onPress={() => {
                pickFile();
              }}
            >
              <Text style={[styles.text, styles.buttonText]}>Choose Image</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleUpdateProduct}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel Update</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#264143",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "60%",
    margin: "1%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    flex: 1,
    width: "80%",
    marginTop: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  editButton: {
    color: "blue",
  },
  deleteButton: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  productImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

export default ProductsScreen;
