import { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getStoredCart } from "../../../LocalStorage";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";
import useOffer from "../Hooks/useOffer";

const Proceed = () => {
    const product = useLoaderData();
    const [quantity, setQuantity] = useState(1);
    const { user } = useContext(AuthContext);

    const globalOfferPercent = useOffer();

    const { _id, title, description, price, discountPercentage, brand, thumbnail, images, stock, specialDiscount } = product;

    const { type = null, freeProductThreshold = null, freeProductCount = null, discountThreshold = null, discountAmount = null } = specialDiscount || {};
    // console.log(specialDiscount);

    const handleQuantityChange = (e) => {
        if (parseInt(e.target.value) < 1) {
            setQuantity(1);
        }
        else if (parseInt(e.target.value) > product.stock) {
            setQuantity(product.stock);
        }
        else {
            setQuantity(parseInt(e.target.value));
        }
    };

    const totalPrice = (product.price * quantity).toFixed(2);
    const discount = ((product.price * quantity) * (product.discountPercentage / 100)).toFixed(2);
    let discountPrice = 0;
    if (discountThreshold && quantity >= discountThreshold) {
        discountPrice = (price * quantity * (discountAmount / 100)).toFixed(2);
    }
    // else if (freeProductThreshold && quantity >= freeProductThreshold) {
    //     discountPrice = price.toFixed(2);
    //     // console.log("get product free...", discountPrice);
    // }
    if (globalOfferPercent > 0) {
        discountPrice = (parseFloat(discountPrice) + (price * quantity * (globalOfferPercent / 100))).toFixed(2);
    }
    // const specialDiscount = ((product.price * quantity) * (discountRate / 100)).toFixed(2);
    const grandTotal = (totalPrice - discount - discountPrice).toFixed(2);


    const handleUpdateProduct = async() => {
        const newStock = stock - (freeProductThreshold && quantity >= freeProductThreshold ? quantity + freeProductCount : quantity);
        const updateProduct = {
            title, description, price, discountPercentage, brand, thumbnail, images, stock: newStock, specialDiscount
        }

        await axios.patch(`http://localhost:5000/updateProduct/${_id}`, updateProduct);
    }


    const handleBuyNow = () => {
        if (!user) {
            alert("Please login first to buy any product");
            return;
        }

        let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

        // if (freeProductThreshold && quantity >= freeProductThreshold){
        //     const newQuantity = quantity + 1;
        //     setQuantity(newQuantity);
        //     console.log(quantity, "qqqqqqqqq");
        // }

        const item = {
            productId: product._id,
            title: product.title,
            price: grandTotal,
            quantity: freeProductThreshold && quantity >= freeProductThreshold ? quantity + freeProductCount : quantity,
            specialDiscount
        };

        const newPurchase = {
            items: [item],
            total: grandTotal,
            userEmail: user.email,
            date: new Date().toISOString()
        };

        axios.post("http://localhost:5000/addPurchase", newPurchase)
            .then( async(res) => {
                if (res.data.insertedId) {
                    await handleUpdateProduct();
                    alert(`Purchase successful! Total: $${grandTotal}`);
                    window.location.reload();
                }
            })
            .catch(error => console.log(error));

        purchaseHistory.push(newPurchase);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
    };


    const handleAddToCart = () => {
        const item = {
            productId: product._id,
            title: product.title,
            price: grandTotal,
            quantity: freeProductThreshold && quantity >= freeProductThreshold ? quantity + freeProductCount : quantity,
            specialDiscount
        };

        let cart = getStoredCart();

        // Check if the product is already in the cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);

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
                globalOfferPercent > 0 && <>
                    <div className="text-center mb-5">
                        <p className="text-red-500">You get special {globalOfferPercent}% off for your current purchase</p>
                    </div>
                </>
            }
            <div className="border rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-4">{title}</h2>
                <div className="flex justify-between">
                    <div className="flex items-center mb-4">
                        <span className="text-gray-700 font-bold text-xl">${price}</span>
                        <span className="text-sm text-gray-600">({discountPercentage}% off)</span>
                    </div>
                    <div>
                        {
                            (specialDiscount && type === "freeProduct") && (
                                <div className="">
                                    <p className="text-gray-700 "><span className="text-red-500">Buy {freeProductThreshold} and get {freeProductCount} free</span></p>
                                </div>
                            )
                        }
                        {
                            (specialDiscount && type === "percentageDiscount") && <>
                                <div className="">
                                    <p className="text-gray-700 "><span className="text-red-500">Buy {discountThreshold} and get {discountAmount}% off</span></p>
                                </div>
                            </>
                        }
                    </div>
                    <div>
                        <span className="text-gray-700 text-xl"><span className="font-bold">Stock:</span> {stock}</span>
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
                    discountPrice > 0 && <>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Special Discount:</label>
                            <span className="ml-2">${discountPrice}</span>
                        </div>
                    </>
                }
                {
                    (freeProductThreshold && quantity >= freeProductThreshold) && <>
                        <div className="mb-4">
                            <label className="text-gray-700 font-bold">Special Discount:</label>
                            <span className="ml-2">You get {freeProductCount} product free </span>
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
