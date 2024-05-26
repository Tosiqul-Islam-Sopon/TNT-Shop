import { useContext, useEffect, useState } from "react";
import { getStoredCart } from "../../../LocalStorage";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";

const Cart = () => {
    const [cart, setCart] = useState(getStoredCart());
    const { user } = useContext(AuthContext);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * 1), 0).toFixed(2);

    const [eligibility, setEligibility] = useState(false);

    const checkDiscountEligibility = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const recentPurchases = purchaseHistory.slice(-2);

        return recentPurchases.length === 2 && recentPurchases.every(purchase => purchase.total >= 5000);
    };

    useEffect(() => {
        setEligibility(checkDiscountEligibility());
    }, [eligibility]);

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cart.filter(item => item.productId !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.location.reload();
    };

    const handleBuyNow = () => {

        if (!user) {
            alert(`Please login first to buy any product`);
            return;
        }
        const newPurchase = {
            items: cart,
            total: totalPrice,
            userEmail: user.email
        };

        axios.post("http://localhost:5000/addPurchase", newPurchase)
            .then(res => console.log(res.data))
            .catch(error => console.log(error))

            
        alert(`Purchase successful! Total: $${totalPrice}`);
        localStorage.removeItem("cart");
        window.location.reload();
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            {
                eligibility ? <>
                    <div className="text-center mb-5">
                        <p className="text-red-500">You get special 30% off for your current purchase</p>
                    </div>
                </>
                    :
                    <>
                        <div className="text-center mb-5">
                            <p className="text-green-600">You will get special 30% off for your next purchase if you buy $5000 or more for two consecutive time</p>
                        </div>
                    </>
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
                                    <button onClick={() => handleRemoveFromCart(item.productId)} className="text-red-500 font-semibold ">Remove</button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Quantity: {item.quantity}</span>
                                    <span className="font-semibold">${(item.price * 1).toFixed(2)}</span>
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
