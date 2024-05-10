import AsyncStorage from "@react-native-async-storage/async-storage"; 
const AsyncStorageFun = () => {
  
}
const saveDataToStorage = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Data saved to AsyncStorage");
  } catch (error) {
    console.error("Error saving data to AsyncStorage:", error);
  }
};
const loadDataFromStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      const data = JSON.parse(jsonValue);
    return data; // Update the todos state with the data from AsyncStorage
    } else {
      console.log("No data found in AsyncStorage");
    }
  } catch (error) {
    console.error("Error loading data from AsyncStorage:", error);
  }
};

export  {AsyncStorageFun ,saveDataToStorage 
  ,loadDataFromStorage, };
