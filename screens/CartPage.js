import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Image } from 'react-native';

const CartProduct = () => {
  const [quantity, setQuantity] = useState(0);
  const pricePerItem = 10.00;

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = (quantity * pricePerItem).toFixed(2);

  return (
    <View style={styles.container}>
      <Image
        style={{ width: '100%', height: '70%', }}
        source={require("../assets/images/clothes1.jpg")}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>Product Name</Text>
        <Text style={styles.price}>Price per item: ${pricePerItem}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable style={styles.button} onPress={decreaseQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.quantity}>{quantity}</Text>
        <Pressable style={styles.button} onPress={increaseQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
      <Text>Total Price: ${totalPrice}</Text>
        <Pressable style={styles.buttonAdd}>
          <Text style={styles.buttonText}>Add To Cart</Text>
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginTop:30,
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#636970',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonAdd: {
    backgroundColor: '#636970',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop:30,
    width:300
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  productDetailsText: {
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default CartProduct;
