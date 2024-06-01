import { useContext, useEffect, useState } from "react";
import { getStoredCart } from "../../../LocalStorage";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";

const Cart = () => {
    const [cart, setCart] = useState(getStoredCart());
    const { user } = useContext(AuthContext);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

    const [eligibility, setEligibility] = useState(false);

    const checkDiscountEligibility = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const recentPurchases = purchaseHistory.slice(-2);

        return recentPurchases.length === 2 && recentPurchases.every(purchase => purchase.total >= 5000);
    };

    useEffect(() => {
        setEligibility(checkDiscountEligibility());
    }, []);

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cart.filter(item => item.productId !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.location.reload();
    };

    const handleUpdateProduct = async () => {
        try {
            for (let i = 0; i < cart.length; i++) {
                const id = cart[i].productId;
                const quantity = cart[i].quantity;
                const res = await axios.get(`http://localhost:5000/product/${id}`);
                const product = res.data;
                const { stock } = product;

                const updateProduct = { ...product, stock: stock - quantity };
                await axios.patch(`http://localhost:5000/updateProduct/${id}`, updateProduct);
            }
        } catch (error) {
            console.error("Error updating product stock:", error);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            alert("Please login first to buy any product");
            return;
        }
    
        const newPurchase = {
            items: cart,
            total: totalPrice,
            userEmail: user.email,
            date: new Date().toISOString() // Adding the current date
        };
    
        try {
            const res = await axios.post("http://localhost:5000/addPurchase", newPurchase);
            if (res.data.insertedId) {
                await handleUpdateProduct();
                alert(`Purchase successful! Total: $${totalPrice}`);
                localStorage.removeItem("cart");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="max-w-4xl mx-auto mt-8">
            {
                eligibility ? (
                    <div className="text-center mb-5">
                        <p className="text-red-500">You get special 30% off for your current purchase</p>
                    </div>
                ) : (
                    <div className="text-center mb-5">
                        <p className="text-green-600">You will get special 30% off for your next purchase if you buy $5000 or more for two consecutive times</p>
                    </div>
                )
            }
            <h2 className="text-3xl font-semibold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="border rounded-lg p-8">
                    {
                        cart.map(item => (
                            <div key={item.productId} className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <button onClick={() => handleRemoveFromCart(item.productId)} className="text-red-500 font-semibold">Remove</button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Quantity: {item.quantity}</span>
                                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    }
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Total Price: ${totalPrice}</h3>
                        <div className="mt-4">
                            <button onClick={handleBuyNow} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
