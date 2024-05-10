import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { getProductById } from "../firebase/products";
import { AddProductTocart } from "../firebase/Cart";
import { getCurrentUserUuid } from "../firebase/users";
import {
  addRate,
  deleteRate,
  getAverageRate,
  checkUserRating,
  getRateByUserIdAndProductId,
} from "../firebase/Rates"; 
import StarRating from "../components/StarRating";
import { router } from "expo-router";
import { subscribe } from "../firebase/Rates";
const ProductPage = ({ id, hasRatedd }) => {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    async function fetchData() {
      getCurrentUser();
      fetchRateByUserIdAndProductId();
      checkUserRatingStatus();
      setHasRated(hasRatedd);
      fetchProduct();
      fetchAverageRating();
    }
    fetchData();
  }, []);
  const fetchProduct = async () => {
    const fetchedProduct = await getProductById(id);
    setProduct(fetchedProduct);
  };
  const fetchRateByUserIdAndProductId = async () => {
    try {
      const fetchedRates = await getRateByUserIdAndProductId(userId, id);
      const rateQuantities = fetchedRates.map((rate) => rate.RateQuantity);
      setRating(rateQuantities);
      console.log(rateQuantities);
    } catch (error) {
      console.error("Error fetching rates by user ID and product ID:", error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUserUuid();
      setUserId(currentUser);
      const userRated = await checkUserRating(currentUser, id);
      setHasRated(userRated);
    } catch (error) {
      console.error(
        "Error getting current user or checking user rating:",
        error
      );
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = (quantity * product.price).toFixed(2);

  const handleAddToCart = () => {
    const newcart = {
      userId: userId,
      ProductId: id,
      productQuantity: quantity,
      totalPrice: totalPrice,
    };
    AddProductTocart(newcart);
  };

  const handleRatingSubmit = async () => {
    try {
      const newRate = {
        userId: userId,
        ProductId: id,
        RateQuantity: rating,
      };
      await addRate(newRate);
      checkUserRatingStatus();
      fetchAverageRating();
      setHasRated(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleRatingDelete = async () => {
    try {
      await deleteRate(userId, id);
      fetchAverageRating();
      checkUserRatingStatus();
      setRating(0);
      setHasRated(false);
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const avgRating = await getAverageRate(id);
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const checkUserRatingStatus = async () => {
    try {
      const hasUserRated = await checkUserRating(userId, id);
      setHasRated(hasUserRated);
    } catch (error) {
      console.error("Error checking user rating status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Pressable
          onPress={() => router.replace("/app")}
          style={styles.backButton}
        >
          <Image
            style={{ width: 25, height: 25, borderRadius: 100 }}
            source={require("../assets/images/th_1.jpg")}
          />
        </Pressable>
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri: product.photoURL }}
        />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>
          {product ? product.name : "Loading..."}
        </Text>
        <Text style={styles.price}>Price per item: ${product.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable style={styles.button} onPress={decreaseQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.quantity}>{quantity}</Text>
        <Pressable style={styles.button} onPress={increaseQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
      <Text style={{ marginBottom: 10, marginTop: 5, fontWeight: "bold" }}>
        Total Price: ${totalPrice}
      </Text>
      <StarRating rating={rating} onRatingChange={setRating} />
      {hasRated ? (
        <Pressable style={styles.buttonAction} onPress={handleRatingDelete}>
          <Text style={styles.buttonText}>Delete Rating</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.buttonAction} onPress={handleRatingSubmit}>
          <Text style={styles.buttonText}>Submit Rating</Text>
        </Pressable>
      )}

      <Text style={{ fontWeight: "bold" }}>
        Average Rating: {averageRating}
      </Text>
      <Pressable style={styles.buttonAdd} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add To Cart</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "30%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#636970",
    paddingTop: 7,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 30,
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  buttonAdd: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    width: 300,
  },
  buttonAction: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 30,
    width: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProductPage;
