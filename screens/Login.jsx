import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { signInHandler, signUpHandler } from "../firebase/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const HandleSignIn = () => {
    signInHandler(email, password, setError);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.imageBox]}>
          <Image
          style={{ width: 300, height: 150,marginTop:100 }}
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
            placeholder="strong password"
            secureTextEntry
          />
        </View>
        <View style={[styles.inputBox]}>
          {error && <Text style={styles.textError}>{error}</Text>}
        </View>
        <View style={[styles.buttonBox]}>
          <Pressable style={styles.button} onPress={() => HandleSignIn()}>
            <Text style={[styles.text, styles.textButton]}>Sign in</Text>
          </Pressable>
          <Link href={"/account/forgetPassword"} style={styles.textLink}>
            ForgetPassword??
          </Link>
          <Link href={"/account/register"} style={styles.textLink}>
            I dont have account go to Sign up
          </Link>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: "10%",
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

export default Login;
