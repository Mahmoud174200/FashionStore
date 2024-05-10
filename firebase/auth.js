import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { collection } from "firebase/firestore";
import { router } from "expo-router";
import { auth, db } from "./Config";
import { CreateUser, getUser, getCurrentUserUuid } from "./users";
import { Alert } from "react-native";
//register
const signUpHandler = async (
  email,
  firstName,
  lastName,
  url,
  password,
  error
) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      uuid: cred.user.uid,
      isadmin: false,
      image: url,
    };
    CreateUser(data);
    console.log(cred.user.email);
    router.replace("/app");
  } catch (err) {
    const message = err.message.substring(err.message.indexOf(":"));
    error(message.substring(2));
    console.log(err.message);
  }
};

const signInHandler = async (email, password, error) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log(cred.user.email);
    const id = getCurrentUserUuid();
    const user = getUser(id);
    router.replace("/app");
  } catch (err) {
    const message = err.message.substring(err.message.indexOf(":"));
    error(message.substring(2));
    console.log(err.message);
  }
};

const signOutHandler = async () => {
  await signOut(auth);
  router.replace("/account/login");
};

const resetPasswordHandler = async (email, error) => {
  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert(
      "The reset password email has been sent. check your email inbox!"
    );
    error("");
  } catch (err) {
    const message = err.message.substring(err.message.indexOf(":"));
    error(message.substring(2));
    console.log(err.message);
  }
};
//updates
const updateUserEmail = async (user, email, error) => {
  try {
    await updateEmail(user, email);
    error("");
  } catch (err) {
    const message = err.message.substring(err.message.indexOf(":"));
    error(message.substring(2));
    console.log(err.message);
  }
};
const updateUserPassword = async (user, password) => {
  try {
    await updatePassword(user, password);
    // error("");
  } catch (err) {
    const message = err.message.substring(err.message.indexOf(":"));
    // err(message.substring(2));
    console.log(err.message);
  }
};

export {
  signUpHandler,
  signInHandler,
  signOutHandler,
  updateUserEmail,
  resetPasswordHandler,
  updateUserPassword,
};
