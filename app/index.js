import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Config";
import { useEffect, useState } from "react";
import Register from "../screens/Login";

import { router } from "expo-router";

export default function Page() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        AsyncStorage.setItem("user", JSON.stringify(user));
        router.replace("/app");
      } else {
        AsyncStorage.removeItem("user");
        router.replace("/account/login");
      }
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <Register></Register>
  );
}
