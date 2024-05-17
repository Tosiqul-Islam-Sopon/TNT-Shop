import { useEffect, useState } from "react";
import { getStoredCart } from "../../../LocalStorage";

const Cart = () => {
    const [cart, setCart] = useState(getStoredCart());
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
        const updatedCart = cart.filter(item => item.id !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.location.reload();
    };

    const handleBuyNow = () => {

        if (!eligibility){
            let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

            const newPurchase = {
                items: cart,
                total: totalPrice
            };
    
            purchaseHistory.push(newPurchase);
            localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        }

        else{
            localStorage.removeItem('purchaseHistory');
        }

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
                    {cart.map(item => (
                        <div key={item.id} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 font-semibold ">Remove</button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Quantity: {item.quantity}</span>
                                <span className="font-semibold">${(item.price * 1).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Total Price: ${totalPrice}</h3>
                        {/* <h3 className="text-lg font-semibold">Delivery Charge: $5.00</h3> */}
                        {/* <h3 className="text-lg font-semibold">Grand Total: ${totalPrice + 5}</h3> */}

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
