import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Providers/AuthProvider";

const ReturnProduct = () => {
    const { id } = useParams();
    const [purchase, setPurchase] = useState(null);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/purchase/${id}`)
            .then(res => {
                setPurchase(res.data);
                const initialQuantities = {};
                res.data.items.forEach(item => {
                    initialQuantities[item.productId] = 0; // Default return quantity is 0
                });
                setReturnQuantities(initialQuantities);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load purchase details.");
                setLoading(false);
                console.log(error);
            });
    }, [id]);

    const handleQuantityChange = (productId, value, quantity, discount) => {
        const parsedValue = isNaN(parseInt(value)) ? 0 : parseInt(value);
        setReturnQuantities(prevState => ({
            ...prevState,
            [productId]: (discount && discount.type === "freeProduct")
                ? (parsedValue > quantity - discount.freeProductCount ? quantity - discount.freeProductCount : parsedValue)
                : (parsedValue > quantity ? quantity : parsedValue)
        }));
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        const returnItems = purchase.items.map(item => ({
            productId: item.productId,
            title: item.title,
            quantity: returnQuantities[item.productId]
        })).filter(item => item.quantity > 0); // Only include items with quantity > 0

        if (returnItems.length) {
            const returnRequest = {
                purchaseId: purchase._id,
                userEmail: user.email,
                items: returnItems,
                status: "pending",
                returnDate: new Date().toISOString()
            };

            try {
                await axios.post("http://localhost:5000/return", returnRequest);
                alert("Return request submitted successfully!");
                navigate("/purchaseHistory"); // Navigate back to purchase history page
            } catch (error) {
                setError("Failed to submit return request.");
                console.log(error);
            }
        }
    };

    const handleDiscountText = (discount, quantity) => {
        if (!discount) return null;
        if (discount && discount.type === "freeProduct" && quantity >= discount.freeProductThreshold) {
            return `Discount of buy ${discount.freeProductThreshold} get ${discount.freeProductCount} free`;
        }
        else if (discount && discount.type === "percentageDiscount" && quantity >= discount.discountThreshold) {
            return `Discount of buy ${discount.discountThreshold} get ${discount.discountAmount}% off`;
        }
        return null;
    };

    if (loading) return <p>Loading purchase details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-3xl font-semibold mb-4">Return Items</h2>
            {purchase ? (
                <form onSubmit={handleReturnSubmit}>
                    <div className="border rounded-lg p-8">
                        {purchase.items.map(item => (
                            <div key={item.productId} className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    {
                                        handleDiscountText(item.specialDiscount, item.quantity) && <p className="text-red-500">
                                            {handleDiscountText(item.specialDiscount, item.quantity)}
                                        </p>
                                    }
                                    <span className="font-semibold">${item.price}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        {item.specialDiscount && item.specialDiscount.type === "freeProduct" && item.quantity >= item.specialDiscount.freeProductThreshold ? (
                                            <>
                                                <p className="font-semibold">Purchased Quantity: {item.quantity - item.specialDiscount.freeProductCount}</p>
                                                <p className="font-semibold">Free Quantity: {item.specialDiscount.freeProductCount}</p>
                                            </>
                                        ) : (
                                            <p className="font-semibold">Purchased Quantity: {item.quantity}</p>
                                        )}
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={item.quantity}
                                        value={returnQuantities[item.productId]}
                                        onChange={(e) => handleQuantityChange(item.productId, e.target.value, item.quantity, item.specialDiscount)}
                                        className="border rounded px-2 py-1"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="mt-4">
                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Submit Return
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p>Loading purchase details...</p>
            )}
        </div>
    );
};

export default ReturnProduct;
