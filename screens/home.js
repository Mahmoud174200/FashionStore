import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddProductTocart } from "../firebase/Cart";

import { getAllProducts } from "../firebase/products";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserUuid, getUser } from "../firebase/users";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase/Config";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
  const [adIndex, setAdIndex] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isadmin, setAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState("");

  const ads = [
    require("../assets/images/ad1.jpg"),
    require("../assets/images/ad2.jpg"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getAllProducts();
    setProducts(fetchedProducts);
    await AsyncStorage.setItem("products", JSON.stringify(fetchedProducts));
    if (!fetchProducts) {
      const storedProducts = await AsyncStorage.getItem("products");
      setProducts(storedProducts);
    }
  };
  const handlePressAddToCart = (item) => {
    if (!item || typeof item.price === "undefined") {
      console.error("Item is undefined or does not have a price property");
      return;
    }
    const { id, price } = item;
    const uid = getCurrentUserUuid();
    const newcart = {
      userId: uid,
      ProductId: id,
      productQuantity: 1,
      totalPrice: price,
    };
    AddProductTocart(newcart);
  };

  const handlePrevAd = () => {
    setAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  const handleNextAd = () => {
    setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handleSearchPress = () => {
    setSearchModalVisible(true);
  };

  const handleCloseSearchModal = () => {
    setSearchModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getCurrentUserUuid();
      const user = await getUser(uid);
      if (user && !user.error) {
        setUserData(user);
      } else {
        console.error("Error fetching user data:", user.error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredResults = products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchTerm, products]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedData);
      setFilteredData(fetchedData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={{
              width: 150,
              height: 90,
              marginRight: 10,
              marginBottom: 10,
            }}
            source={require("../assets/images/pageicon.png")}
          />
          <TextInput
            style={styles.input}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
      </View>
      <View
        style={{ width: "100%", height: 200, marginRight: 20, marginTop: 20 }}
      >
        <Image
          style={{ width: "100%", height: 200, marginRight: 20 }}
          source={ads[adIndex]}
        />
        <TouchableOpacity onPress={handlePrevAd} style={styles.arrowButton}>
          <Text>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextAd}
          style={[styles.arrowButton, { right: 0 }]}
        >
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={{ marginTop: 40, padding: 15 }}>
          <Text style={{ fontSize: 25, fontWeight: 600, color: "#264143" }}>
            Product
          </Text>
        </View>
        {products ? (
          <View style={styles.productContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  {/* Render each product item */}
                  <Pressable
                    onPress={() => router.navigate(`/products/${item.id}`)}
                    style={styles.productItem}
                  >
                    <Image
                      source={{ uri: item.photoURL }}
                      style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productPrice}>{item.price}$</Text>
                      <Pressable
                        onPress={() => handlePressAddToCart(item)}
                        style={{
                          width: 150,
                          marginTop: 10,
                          borderRadius: 15,
                          backgroundColor: "#f54254",
                          flexDirection: "row",
                          padding: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ paddingRight: 15 }}>Add To Cart</Text>
                        <Ionicons name={"cart"} size={25} color={"black"} />
                      </Pressable>
                    </View>
                  </Pressable>
                </View>
              )}
            />
          </View>
        ) : (
          <ActivityIndicator size="large" color="#636970" /> // Render ActivityIndicator while loading
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={handleCloseSearchModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
              />
            </View>
            {/* Add your search functionality here */}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 55,
    backgroundColor: "#F6F6F6",
    padding: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    marginRight: 10,
    marginVertical: 5,
    height: 35,
    fontSize: 13,
    backgroundColor: "white",
    width: 200,
    color:"black"
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  sideMenu: {
    height: 150,
    alignItems: "center",
    top: 10,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -30,
    marginTop: 10,
    width: "100%",
    padding: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10,
    borderColor: "#0a4a7c",
    borderWidth: 1,
    padding: 10,

    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sideMenuItem: {
    paddingVertical: 5,
    fontWeight: "bold",
  },
  productContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  productItem1: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 30,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  searchButton: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
  },
});

export default Home;
