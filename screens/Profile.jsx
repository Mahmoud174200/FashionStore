import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { getCurrentUserUuid, getUser, updateUser } from "../firebase/users";
import { signOutHandler } from "../firebase/auth"; // Assuming this function handles sign-out
import { Ionicons } from "@expo/vector-icons";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isadmin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getCurrentUserUuid();
      const user = await getUser(uid);
      setAdmin(user.isadmin);
      if (user && !user.error) {
        setUserData(user);
      } else {
        console.error("Error fetching user data:", user.error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    signOutHandler();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {userData ? (
          <>
            <View style={[styles.profileContainer, { justifyContent: 'center' }]}>
              <Image
                source={{ uri: userData.image }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{userData.email}</Text>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.text}>30/7/2003</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.replace("/account/editProfile");
              }}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
            {isadmin ? (
              <Pressable
                style={styles.button}
                onPress={() => router.replace("/home/AdminBoard")}
              >
                <Text style={styles.buttonText}>Admin Panel</Text>
              </Pressable>
            ) : (
              <View></View>
            )}
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator size="large" color="#636970" />
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  updatePhotoButton: {
    backgroundColor: "#264143",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "80%",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  updatePhotoTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  updatePhotoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8, // Add margin to separate the icon from text
  },
  camera: {
    marginTop: "20%",
    Left: "5%", // Adjust the marginTop to move the camera icon lower
  },
});

export default Dashboard;