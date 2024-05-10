import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Link, router } from "expo-router";

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.buttonBox}>
        <Link href="/account/Product" style={styles.button}>
          <Text style={styles.buttonText}>Products</Text>
        </Link>
        <Link href="/account/UserS" style={styles.button}>
          <Text style={styles.buttonText}>Users</Text>
        </Link>
        <Pressable
          onPress={() => {
            router.replace("/Profile");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
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
  imageBox: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  buttonBox: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#636970",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 20,
    textAlign: "center",
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

export default Dashboard;
