import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [returnStatuses, setReturnStatuses] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:5000/purchases/${user.email}`)
                .then(res => {
                    const sortedHistory = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPurchaseHistory(sortedHistory);
                    // Fetch return statuses for each purchase
                    sortedHistory.forEach(purchase => {
                        fetchReturnStatus(purchase._id);
                    });
                })
                .catch(error => console.log(error));
        }
    }, [user]);

    const fetchReturnStatus = async (purchaseId) => {
        try {
            const res = await axios.get(`http://localhost:5000/return/${purchaseId}`);
            setReturnStatuses(prevStatuses => ({
                ...prevStatuses,
                [purchaseId]: res.data?.status
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleReturn = (purchaseId) => {
        navigate(`/returnProduct/${purchaseId}`);
    };

    const isWithinLast7Days = (date) => {
        const purchaseDate = new Date(date);
        const today = new Date();
        const timeDifference = today.getTime() - purchaseDate.getTime();
        return timeDifference <= (7 * 24 * 60 * 60 * 1000);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Dhaka'
        });
    };

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
                                <span className="font-semibold">Total Price:</span> ${Number(purchase.total).toFixed(2)}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Purchase Date:</span> {formatDateTime(purchase.date)}
                            </div>
                            <div>
                                <h4 className="font-semibold">Items:</h4>
                                <ul className="list-disc list-inside">
                                    {purchase.items ? (
                                        purchase.items.map(item => (
                                            <li key={item.productId}>
                                                {item.title} - Quantity: {item.quantity} - ${Number(item.price).toFixed(2)}
                                            </li>
                                        ))
                                    ) : (
                                        <li>{purchase.title} - {purchase.quantity}</li>
                                    )}
                                </ul>
                            </div>
                            {isWithinLast7Days(purchase.date) && (
                                returnStatuses[purchase._id] === "pending" ? (
                                    <p className="text-red-500">Return is in process</p>
                                ) : (
                                    <button
                                        onClick={() => handleReturn(purchase._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                                    >
                                        Return
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
