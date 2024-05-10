// Import necessary dependencies
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
// import { updatePassword } from "firebase/auth"; // Import updatePassword method from Firebase Authentication
import { getCurrentUserUuid, getUser , updatePassword } from "../firebase/users"; // Assuming these functions are correctly implemented
import { router } from "expo-router";

// Define the UpdatePassword component
const UpdatePassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to update user's password
  const updateUserPassword = async (user, newPassword) => {
    try {
      await updatePassword(user, newPassword);
      console.log("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error.message);
      throw error;
    }
  };

  // Function to handle updating password
  const handleUpdatePassword = async () => {
    try {
      const id = await getCurrentUserUuid();
      const user = await getUser(id); // Implement getUser function to fetch user data
      await updateUserPassword(user, password);
      Alert.alert("Password Updated Successfully");
    } catch (error) {
      console.error("Error updating password:", error.message);
      Alert.alert("Error", "Failed to update password.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageBox]}>
        <Image
          style={{ width: 300, height: 150 }}
          source={require("../assets/images/pageicon.png")}
        />
      </View>
      <View style={[styles.inputBox]}>
        <Text style={[styles.text, styles.inputLabel]}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="example@something.com"
        />
      </View>
      <View style={[styles.inputBox]}>
        <Text style={[styles.text, styles.inputLabel]}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder="Newpassword"
          secureTextEntry
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          handleUpdatePassword();
        }}
      >
        <Text style={[styles.text, styles.textButton]}>Update Password</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          router.replace("/Profile");
        }}
      >
        <Text style={[styles.text, styles.textButton]}>Back To Profile</Text>
      </Pressable>
    </View>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "#3d0f91",
    justifyContent: "center",
    width: "80%",
    marginHorizontal: "10%",
  },
  text: {
    fontWeight: "bold",
    color: "#264143",
  },
  input: {
    padding: "1%",
    borderBottomWidth: 8,
    borderColor: "#264143",
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    marginVertical: "1%",
    fontWeight: "bold",
    height: 50,
  },
  imageBox: {
    alignItems: "center",
    marginBottom: "10%",
    flex: 0.5,
  },
  inputLabel: {
    fontSize: 15,
  },
  inputBox: {
    marginTop: "5%",
  },
  buttonBox: {
    alignItems: "center",
    marginTop: "5%",
  },
  button: {
    backgroundColor: "#264143",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    padding: "1%",
    borderRadius: 15,
    margin: "5%",
    left: "15%",
  },
  textButton: {
    color: "white",
    fontSize: 17,
  },
});

export default UpdatePassword;
