import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getStoredCart } from "../../../LocalStorage";

const Proceed = () => {
    const product = useLoaderData();
    const [quantity, setQuantity] = useState(1);
    const [discountRate, setDiscountRate] = useState(0);
    const [eligibility, setEligibility] = useState(false);

    const checkDiscountEligibility = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const recentPurchases = purchaseHistory.slice(-2);

        return recentPurchases.length === 2 && recentPurchases.every(purchase => purchase.total >= 5000);
    };

    useEffect(() => {
        setEligibility(checkDiscountEligibility());
        if (eligibility)    setDiscountRate(30);
    }, [eligibility]);

    const handleQuantityChange = (e) => {
        setQuantity(parseInt(e.target.value));
    };

    const totalPrice = (product.price * quantity).toFixed(2);
    const discount = ((product.price * quantity) * (product.discountPercentage / 100)).toFixed(2);
    const specialDiscount = ((product.price * quantity) * (discountRate / 100)).toFixed(2);
    const grandTotal = (totalPrice - discount - specialDiscount).toFixed(2);

    const handleBuyNow = () => {

        if (!eligibility){
            let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

            const newPurchase = {
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: quantity,
                total: grandTotal
            };
    
            purchaseHistory.push(newPurchase);
            localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        }

        else{
            localStorage.removeItem('purchaseHistory');
        }

        alert(`Purchase successful! Total: $${grandTotal}`);
        window.location.reload();
    };

    const handleAddToCart = () => {
        const item = {
            id: product.id,
            title: product.title,
            price: grandTotal,
            quantity: quantity
        };

        let cart = getStoredCart();

        // Check if the product is already in the cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // If the product is already in the cart, remove it
            cart.splice(existingItemIndex, 1);
        }

        // Add the new item to the cart
        cart.push(item);

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart successfully!");
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
            <div className="border rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-4">{product.title}</h2>
                <div className="flex justify-between">
                    <div className="flex items-center mb-4">
                        <span className="text-gray-700 font-bold text-xl">${product.price}</span>
                        <span className="text-sm text-gray-600">({product.discountPercentage}% off)</span>
                    </div>
                    <div>
                        <span className="text-gray-700 text-xl"><span className="font-bold">Stock:</span> {product.stock}</span>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 font-bold">Quantity:</label>
                    <input type="number" className="ml-2 p-2 border rounded" value={quantity} min="1" max={product.stock} onChange={handleQuantityChange} />
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 font-bold">Total Price:</label>
                    <span className="ml-2">${totalPrice}</span>
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 font-bold">Discount:</label>
                    <span className="ml-2">${discount}</span>
                </div>
                {
                    eligibility && <>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Special Discount:</label>
                            <span className="ml-2">${specialDiscount}</span>
                        </div>
                    </>
                }
                <div className="mb-4">
                    <label className="text-gray-700 font-bold">Grand Total:</label>
                    <span className="ml-2">${grandTotal}</span>
                </div>
                <div className="mt-4">
                    <button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                        Add to Cart
                    </button>
                    <button onClick={handleBuyNow} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Proceed;
