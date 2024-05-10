import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebase/Config"; 
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getProductsCart,
  AddProductTocart,
  deleteProductFromCart,
  subscribe,
} from "../firebase/Cart";
import { getProductById } from "../firebase/products";
import { router } from "expo-router";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const fetchCarts = await getProductsCart();
      setCartItems(fetchCarts);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribe(({ change, snapshot }) => {
      if (
        change.type === "added" ||
        change.type === "modified" ||
        change.type === "removed"
      ) {
        console.log(`${change.type} Product:`, change.doc.data());
        fetchCarts();
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Image
          style={{ width: 25, height: 25, margin: 3, borderRadius: 100 }}
          source={require("../assets/images/th_1.jpg")}
        />
      </Pressable>
      <Text style={styles.title}>Cart</Text>
      {!cartItems ? (
        <ActivityIndicator size="large" color="#636970" />
      ) : cartItems.length !== 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <CartItem
              key={item.id.toString()} 
              productId={item.ProductId}
              quantity={item.productQuantity}
              totalPrice={item.totalPrice}
              onDelete={() => deleteProductFromCart(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>Your cart is empty</Text>}
        />
      ) : (
        <Text>Your cart is empty</Text>
      )}
    </View>
  );
}

function CartItem({ productId, quantity, totalPrice, onDelete }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  if (!product) {
    return <Text></Text>;
  }

  return (
    <View style={styles.cartItem}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>Total Price: ${totalPrice}</Text>
      <Text style={styles.quantity}>Quantity: {quantity}</Text>
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: product.photoURL }} style={styles.image} />
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#dedede",
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center", 
  },
  price: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
    textAlign: "center",
  },
  quantity: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    textAlign: "center", 
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "center", 
    width: "30%", 
    marginTop:15,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
