import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { getCurrentUserUuid, getUser, updateUser } from "../firebase/users";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const EditProfile = () => {
  const [userdata, setUserData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      image: image,
    };
    const id = await getCurrentUserUuid();
    await updateUser(data, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = await getCurrentUserUuid();
        const user = await getUser(uid);
        if (user && !user.error) {
          setUserData(user);
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setImage(user.image || "");
        } else {
          console.error("Error fetching user data:", user.error);
          Alert.alert("Error", "Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
      }
    };
    fetchData();
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
        alert("Image Uploaded");
      } else {
        alert(" Upload Image Canceled");
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
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace("/Profile")}>
        <Image
          style={{ width: 25, height: 25, margin: 3 }}
          source={require("../assets/images/th_1.jpg")}
        />
      </Pressable>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="FirstName"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="LastName"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          pickFile();
        }}
      >
        <Text style={styles.buttonText}>Change Image Profile</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.replace("/Profile")}
      >
        <Text style={styles.buttonText}>Back To Profile</Text>
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
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    paddingVertical: 12,
    borderRadius: 15,
    margin: "0.5%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default EditProfile;
