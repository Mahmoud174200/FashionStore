import React from "react";
import { useState } from "react";
import { Link } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { resetPasswordHandler } from "../firebase/auth";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const HandlerRestPassword = () => {
    resetPasswordHandler(email, setError, setStatus);
  };
  return (
    <View style={[styles.inputBox]}>
      <View style={[styles.imageBox]}>
        <Image
          style={{ width: 300, height: 150 }}
          source={require("../assets/images/pageicon.png")}
        />
      </View>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(value) => setEmail(value)}
        placeholder="example@something.com"
      />
      <View style={[styles.inputBox]}>
        {error && <Text style={styles.textError}>{error}</Text>}
        {status && <Text style={styles.status}>{status}</Text>}
      </View>
      <View style={[styles.buttonBox]}>
        <Pressable style={styles.button} onPress={() => HandlerRestPassword()}>
          <Text style={[styles.text, styles.textButton]}>Send</Text>
        </Pressable>
        <Link href={"/account/login"} style={styles.textLink}>
          I have an Account. Go to Sign In
        </Link>
        <Link href={"/account/register"} style={styles.textLink}>
          I don't have an Account. Resgister
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "#000000",
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
    paddingLeft:15,
    borderWidth: 2,
    borderColor: "#264143",
    borderRadius: 15,
    borderWidth: 3,
    marginVertical: "1%",
    color: "#264143",
    width: "92%",
    left: "5%",
  },
  imageBox: {
    alignItems: "center",
    marginBottom: "10%",
  },
  inputLabel: {
    fontSize: 15,
    color: "#264143",
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
  },
  textButton: {
    color: "#ffffff",
    fontSize: 17,
  },
  textLink: {
    color: "#a7a7a7",
    textDecorationLine: "underline",
    marginTop: "1.5%",
  },
  textError: {
    color: "red",
    fontWeight: "500",
  },
  image: {
    width: 100,
    height: 100,
  },
  icons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default ForgetPassword;
