import { auth, db } from "./Config";
import {getCurrentUserUuid}from "./users";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  getDocs,
  doc,
  where,
  onSnapshot,
} from "firebase/firestore";
const collectionReference = collection(db, "Cart");
const AddProductTocart = async (data) => {
  try {
    if(data.productQuantity!=0){
      const newProduct = await addDoc(collectionReference, data);
      console.log("Suceess to add Cart" + newProduct);
      alert("Product added to cart successfully");
    }else{
      alert("please increase the quantity :)");
    }
  } catch (err) {
    console.log("fail to add Product to Cart " + err.message);
  }
  console.log(data);
};
const deleteProductFromCart = async (id) => {
  const docReference = doc(db, "Cart", id);
  try {
    await deleteDoc(docReference);
    console.log("Success to Delete Product from Cart",id);
  } catch (err) {
    console.log("delete Product from CarT: ", err.message);
  }
};
const getProductsCart = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "Cart"), where("userId", "==",getCurrentUserUuid())));
    const ListProducts = [];
    querySnapshot.forEach((doc) => {
      ListProducts.push({ id: doc.id, ...doc.data() });
    });
      return  ListProducts;
  } catch (error) {
    console.error("Error fetching Products Cart:", error);
  }
};

function subscribe(callback) {
  const unsubscribe = onSnapshot(query(collection(db, "Cart")), (snapshot) => {
    const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
    snapshot.docChanges().forEach((change) => {
      
      if (callback) callback({ change, snapshot });
    });
  });
  return unsubscribe;
}

export {AddProductTocart ,getProductsCart ,deleteProductFromCart , subscribe};