import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditOffer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState({
        type: "",
        threshold: 0,
        discountAmount: 0,
        minimumConsecutivePurchase: 0,
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/offers/${id}`)
            .then(response => {
                setOffer(response.data);
            })
            .catch(error => {
                console.error("Error fetching offer:", error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOffer({
            ...offer,
            [name]: ['threshold', 'discountAmount', 'minimumConsecutivePurchase'].includes(name) ? parseFloat(value) : value
        });
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/offers/${id}`, offer)
            .then((res) => {
                // console.log(res.data);
                if (res.data.modifiedCount){
                    alert("Offer updated successfully");
                }
                navigate("/offers");
            })
            .catch(error => {
                console.error("Error saving changes:", error);
            });
        // console.log(offer);
    };

    return (
        <div className="max-w-4xl mx-auto my-8">
            <h1 className="text-3xl font-bold mb-6">Edit Offer</h1>
            <form onSubmit={handleSaveChanges}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                        Offer Type
                    </label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        required
                        value={offer.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="threshold">
                        Threshold
                    </label>
                    <input
                        type="number"
                        id="threshold"
                        name="threshold"
                        required
                        value={offer.threshold}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        step="0.01"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountAmount">
                        Discount Amount
                    </label>
                    <input
                        type="number"
                        id="discountAmount"
                        name="discountAmount"
                        required
                        value={offer.discountAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        step="0.01"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimumConsecutivePurchase">
                        Minimum Consecutive Purchase
                    </label>
                    <input
                        type="number"
                        id="minimumConsecutivePurchase"
                        name="minimumConsecutivePurchase"
                        required
                        value={offer.minimumConsecutivePurchase}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        required
                        value={offer.startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        required
                        value={offer.endDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditOffer;
