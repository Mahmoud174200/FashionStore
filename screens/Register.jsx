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
import { Link } from "expo-router";
import { signUpHandler } from "../firebase/auth";
import firebase from "firebase/compat/app";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Images and videos
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      await  HandleUpdate();
      }
    } catch (error) {
      console.error("Error Picking Image:", error);
    }
  };
  const HandleUpdate=async()=>{
    await uploadFile();
  }
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
      // setImage(nul/l);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };
  const HandleSignUp = () => {
    signUpHandler(email, firstName, lastName, url, password, setError);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.imageBox]}>
        <Image
          style={{ width: 150, height: 100,marginTop:20 }}
          source={require("../assets/images/pageicon.png")}
        />
      </View>
      <View style={[styles.inputBox]}>
        <Text style={[styles.text, styles.inputLabel]}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(value) => setFirstName(value)}
          placeholder="first name"
        />
      </View>
      <View style={[styles.inputBox]}>
        <Text style={[styles.text, styles.inputLabel]}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(value) => setLastName(value)}
          placeholder="last name"
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
          placeholder="strong password"
          secureTextEntry
        />
      </View>
      <View style={[styles.inputBox]}>
        {error && <Text style={styles.textError}>{error}</Text>}
      </View>
      <View style={[styles.buttonBox]}>
        <Pressable
          style={styles.button}
          onPress={() => {
            pickFile();
          }}
        >
          <Text style={[styles.text, styles.textButton]}> Choose Image</Text>
        </Pressable>
      </View>
      <View style={[styles.buttonBox]}>
        <Pressable style={styles.button} onPress={() => HandleSignUp()}>
          <Text style={[styles.text, styles.textButton]}>Sign Up</Text>
        </Pressable>
        <Link href={"/account/login"} style={styles.textLink}>
          I have an Account. Go to Sign In
        </Link>
      </View>
    </View>
  );
};

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
    marginBottom: "30%",
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
    height:45,
    padding: "1%",
    borderRadius: 15,
  },
  textButton: {
    color: "white",
    fontSize: 17,
  },
  textLink: {
    color: "#264143",
    textDecorationLine: "underline",
    marginTop: "1.5%",
  },
  textError: {
    color: "red",
    fontWeight: "500",
  },
  logo1: {
    justifyContent: "left",
  },
});

export default Register;
