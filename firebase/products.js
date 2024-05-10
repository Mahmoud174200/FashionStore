// Import firestore functions
import { Alert } from "react-native";
import { auth, db } from "./Config";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";

// Define collection reference
const productCollectionReference = collection(db, "products");

// Function to create a product
const createProduct = async (data) => {
  try {
    const newProduct = await addDoc(productCollectionReference, data);
    console.log("Product added successfully:", newProduct.id);
  } catch (err) {
    console.log("Failed to add product:", err.message);
  }
};

// Function to update a product
const updateProduct = async (productId, newData) => {
  const productRef = doc(db, "products", productId);
  try {
    await updateDoc(productRef, newData);
    console.log("Product updated successfully!");
    alert("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Function to delete a product
const deleteProduct = async (productId) => {
  try {
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
    console.log("Product deleted successfully!");
    Alert.alert("Product deleted successfully!");
  } catch (err) {
    console.log("Failed to delete product:", err.message);
  }
};

// Function to retrieve all products
const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(productCollectionReference);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ ...doc.data(), id: doc.id });
    });
    return products;
  } catch (err) {
    console.log("Failed to retrieve products:", err.message);
  }
};
const getProductById = async (productId) => {
  try {
    const productDocRef = doc(db, "products", productId);
    const productDocSnapshot = await getDoc(productDocRef);
    if (productDocSnapshot.exists()) {
      return { ...productDocSnapshot.data(), id: productDocSnapshot.id };
    } else {
      console.log("Product not found!");
      return null;
    }
  } catch (err) {
    console.log("Failed to retrieve product:", err.message);
    return null;
  }
};

function subscribe(callback) {
  const unsubscribe = onSnapshot(query(collection(db, "products")), (snapshot) => {
    const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
    snapshot.docChanges().forEach((change) => {
      
      if (callback) callback({ change, snapshot });
    });
  });
  return unsubscribe;
}

// Example usage:
const exampleProductData = {
  name: "Example Product",
  price: 100,
  description: "This is an example product.",
};

// Creating a new product
export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  subscribe,
};
