import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const useOffer = () => {
    const [offers, setOffers] = useState([]);
    const [history, setHistory] = useState([]);
    const [percent, setPercent] = useState(0);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/offers");
                setOffers(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchHistory = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(`http://localhost:5000/purchases/${user.email}`);
                    setHistory(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchOffers();
        fetchHistory();
    }, [user]);

    useEffect(() => {
        const calculateDiscount = () => {
            let totalPercent = 0;
            for (let i = 0; i < offers.length; i++) {
                const needHistory = history.slice(-offers[i].minimumConsecutivePurchase);
                if (needHistory.length >= offers[i].minimumConsecutivePurchase) {
                    if (needHistory.every(purchase => purchase.total >= offers[i].threshold)) {
                        totalPercent += offers[i].discountAmount;
                    }
                }
            }
            // Fix the percent to two decimal places
            setPercent(parseFloat(totalPercent.toFixed(2)));
        };

        calculateDiscount();
    }, [offers, history]);

    return percent;
};

export default useOffer;
