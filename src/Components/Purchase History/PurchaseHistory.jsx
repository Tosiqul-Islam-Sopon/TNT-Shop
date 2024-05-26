import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const PurchaseHistory = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/purchases/${user?.email}`)
            .then(res => setPurchaseHistory(res.data))
            .catch(error => console.log(error))
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-3xl font-semibold mb-4">Purchase History</h2>
            {purchaseHistory.length === 0 ? (
                <p>No purchases made yet.</p>
            ) : (
                <div className="border rounded-lg p-8">
                    {purchaseHistory.map((purchase, index) => (
                        <div key={index} className="mb-4 border-b pb-4">
                            <h3 className="text-lg font-semibold mb-2">Purchase #{index + 1}</h3>
                            <div className="mb-2">
                                <span className="font-semibold">Total Price:</span> ${purchase.total}
                            </div>
                            <div>
                                <h4 className="font-semibold">Items:</h4>
                                <ul className="list-disc list-inside">
                                    {
                                        purchase.items ? <>
                                            {
                                                purchase.items?.map(item => (
                                                    <li key={item.productId}>
                                                        {item.title} - Quantity: {item.quantity} - ${item.price} each
                                                    </li>
                                                ))
                                            }
                                        </>
                                            :
                                            <>
                                                <li>{purchase.title} - {purchase.quantity}</li>
                                            </>

                                    }
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
