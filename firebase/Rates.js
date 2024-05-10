import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    doc,
  } from "firebase/firestore";
  import { db } from "./Config";

  
  const ratesCollection = collection(db, "rates");
  
  // Method to add a new rate
  const addRate = async (rateData) => {
    try {
      await addDoc(ratesCollection, rateData);
      console.log("Rate added successfully.");
    } catch (error) {
      console.error("Error adding rate:", error);
    }
  };
  
  // Method to calculate the average rate for a product
  const getAverageRate = async (productId) => {
    try {
      const querySnapshot = await getDocs(
        query(ratesCollection, where("ProductId", "==", productId))
      );
  
      let totalStars = 0;
      let count = 0;
  
      querySnapshot.forEach((doc) => {
        const rateData = doc.data();
        totalStars += rateData.RateQuantity;
        count++;
      });
  
      if (count === 0) {
        return 0; // No rates yet
      }
  
      return totalStars / count;
    } catch (error) {
      console.error("Error calculating average rate:", error);
      return 0;
    }
  };
  
  // Method to delete a rate
  const deleteRate = async (userId, productId) => {
    try {
      // Query the rates collection to find the rate with matching userId and productId
      const querySnapshot = await getDocs(
        query(
          collection(db, "rates"),
          where("userId", "==", userId),
          where("ProductId", "==", productId)
        )
      );
  
      // Check if there are any documents returned
      if (!querySnapshot.empty) {
        // Delete the rate document
        const rateDoc = querySnapshot.docs[0]; // Assuming there's only one matching rate
        await deleteDoc(rateDoc.ref);
        console.log("Rate deleted successfully.");
      } else {
        console.log("No matching rate found.");
      }
    } catch (error) {
      console.error("Error deleting rate:", error);
    }
  };
  
  
  // Method to get all rates for a product
  const getAllRates = async (productId) => {
    try {
      const querySnapshot = await getDocs(
        query(ratesCollection, where("productId", "==", productId))
      );
  
      const rates = [];
      querySnapshot.forEach((doc) => {
        rates.push({ id: doc.id, ...doc.data() });
      });
  
      return rates;
    } catch (error) {
      console.error("Error getting all rates:", error);
      return [];
    }
  };
  
  // Method to get rates by userId
  const getRateByUserIdAndProductId = async (userId,ProductId) => {
    try {
      const querySnapshot = await getDocs(
        query(ratesCollection, where("userId", "==", userId),
        where("ProductId", "==", ProductId))
      );
  
      const rates = [];
      querySnapshot.forEach((doc) => {
        rates.push({ id: doc.id, ...doc.data() });
      });
  
      return rates;
    } catch (error) {
      console.error("Error getting rates by userId:", error);
      return 0;
    }
  };
  const checkUserRating = async (userId, productId) => {
    try {
      const ratingSnapshot = await getDocs(
        query(
          collection(db, "rates"),
          where("userId", "==", userId),
          where("ProductId", "==", productId)
        )
      );
      console.log("rate = "+!ratingSnapshot.empty)
      return !ratingSnapshot.empty;
    } catch (error) {
      console.error('Error checking user rating:', error);
      throw error;
    }
  };
  
  export { addRate, getAverageRate, deleteRate, getAllRates, getRateByUserIdAndProductId,checkUserRating };
  