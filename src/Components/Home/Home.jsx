import { useLoaderData } from "react-router-dom";
import Products from "./Products";
import { useEffect, useState } from "react";

const Home = () => {
    const products = useLoaderData().products;
    const [eligibility, setEligibility] = useState(false);

    const checkDiscountEligibility = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const recentPurchases = purchaseHistory.slice(-2);

        return recentPurchases.length === 2 && recentPurchases.every(purchase => purchase.total >= 5000);
    };

    useEffect(() => {
        setEligibility(checkDiscountEligibility());
    }, [eligibility]);
    // console.log(products);
    return (
        <div>
            {
                eligibility ? <>
                    <div className="text-center my-5">
                        <p className="text-red-500">You get special 30% off for your current purchase</p>
                    </div>
                </>
                :
                <>
                    <div className="text-center my-5">
                        <p className="text-green-600">You will get special 30% off for your next purchase if you buy $5000 or more for two consecutive time</p>
                    </div>
                </>
            }
            <Products products={products}></Products>
        </div>
    );
};

export default Home;