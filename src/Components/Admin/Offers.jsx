import { useState, useEffect } from "react";
import axios from "axios";
import useOffer from "../Hooks/useOffer";

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const percent = useOffer();
    console.log(percent);
    const [newOffer, setNewOffer] = useState({
        type: "",
        threshold: 0,
        discountAmount: 0,
        minimumConsecutivePurchase: 0
    });

    useEffect(() => {
        // Fetch existing offers from the server
        axios.get("http://localhost:5000/offers")
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => {
                console.error("Error fetching offers:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOffer({
            ...newOffer,
            [name]: ['threshold', 'discountAmount', 'minimumConsecutivePurchase'].includes(name) ? parseFloat(value) : value
        });
    };

    const handleAddOffer = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/addOffer", newOffer)
            .then(response => {
                setOffers([...offers, response.data]);
                setNewOffer({ type: "", threshold: 0, discountAmount: 0, minimumConsecutivePurchase: 0 });
            })
            .catch(error => {
                console.error("Error adding offer:", error);
            });
    };

    const handleDeleteOffer = (id) => {
        axios.delete(`http://localhost:5000/offers/${id}`)
            .then(() => {
                setOffers(offers.filter(offer => offer._id !== id));
            })
            .catch(error => {
                console.error("Error deleting offer:", error);
            });
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6">Manage Offers</h1>
            <form onSubmit={handleAddOffer} className="mb-8">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                        Offer Type
                    </label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        required
                        value={newOffer.type}
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
                        value={newOffer.threshold}
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
                        value={newOffer.discountAmount}
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
                        value={newOffer.minimumConsecutivePurchase}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Offer
                </button>
            </form>
            <h2 className="text-2xl font-bold mb-4">Current Offers</h2>
            <ul>
                {offers.map(offer => (
                    <li key={offer._id} className="mb-4 p-4 border rounded">
                        <p><strong>Type:</strong> {offer.type}</p>
                        <p><strong>Threshold:</strong> ${offer.threshold}</p>
                        <p><strong>Discount Amount:</strong> {offer.discountAmount}%</p>
                        <p><strong>Minimum Consecutive Purchase:</strong> {offer.minimumConsecutivePurchase}</p>
                        <button
                            onClick={() => handleDeleteOffer(offer._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Offers;
