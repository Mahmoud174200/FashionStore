import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import {
  CreateUser,
  getAllUsers,
  updateUser,
  deleteUser,
  subscribe,
} from "../firebase/users";

const UsersScreen = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dataUser, setDataUsers] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const getUsersList = async () => {
    try {
      const c = await getAllUsers();
      setDataUsers(c);
      return c;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = subscribe(({ change, snapshot }) => {
      if (change.type === "added") {
        console.log("New User: ", change.doc.data());
        getUsersList();
      }
      if (change.type === "modified") {
        console.log("Modified User: ", change.doc.data());
        getUsersList();
      }
      if (change.type === "removed") {
        console.log("Removed  User: ", change.doc.data());
        getUsersList();
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getUsersList();
  }, []);
  const handleAddUser = async () => {
    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        isadmin: false,
      };
      await CreateUser(userData);
      setAddModalVisible(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) {
        console.error("No user selected for update.");
        return;
      }
      const updatedUser = {
        firstName: firstName || selectedUser.firstName,
        lastName: lastName || selectedUser.lastName,
        email: email || selectedUser.email,
      };
      await updateUser(selectedUser.id, updatedUser);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Pressable
        onPress={() => setAddModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add User</Text>
      </Pressable>
      <FlatList
        data={dataUser}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>
              {item.firstName} {item.lastName}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedUser(item);
                setEditModalVisible(true);
              }}
            >
              <Text style={styles.editButton}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => deleteUser(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal
        visible={addModalVisible}
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Pressable style={styles.addButton} onPress={handleAddUser}>
              <Text style={styles.addButtonText}>Add User</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={editModalVisible}
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Pressable style={styles.addButton} onPress={handleUpdateUser}>
              <Text style={styles.addButtonText}>Save Changes</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#264143",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    alignSelf: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    flex: 1,
    width: "80%",
    marginTop: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  editButton: {
    color: "blue",
  },
  deleteButton: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    alignSelf: "center",
    marginBottom: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UsersScreen;
