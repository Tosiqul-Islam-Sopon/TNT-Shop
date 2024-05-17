import { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";

const ProductDetails = () => {
    const product = useLoaderData();
    const { id, title, description, price, discountPercentage, rating, brand, thumbnail, images, stock } = product;

    const [eligibility, setEligibility] = useState(false);

    const checkDiscountEligibility = () => {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const recentPurchases = purchaseHistory.slice(-2);

        return recentPurchases.length === 2 && recentPurchases.every(purchase => purchase.total >= 5000);
    };

    useEffect(() => {
        setEligibility(checkDiscountEligibility());
    }, []);
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
            <div className="flex">
                <div className="w-1/2">
                    <img className="w-full" src={thumbnail} alt={title} />
                </div>
                <div className="w-1/2 pl-8">
                    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
                    <p className="text-gray-700 mb-4">{description}</p>
                    <div className="flex justify-between items-center border-y-2 py-3">
                        <div>
                            <span className="text-gray-700 font-bold text-xl">${price}</span>
                            <span className="text-sm text-gray-600 ml-2">({discountPercentage}% off)</span>
                        </div>
                        <div className="flex items-center">
                            <p className="text-gray-700"><span className="font-bold">Rating: </span> {rating}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b-2">
                        <div>
                            <p className="text-gray-700 "><span className="font-bold">Brand: </span> {brand}</p>
                        </div>
                        <div className="flex items-center">
                            {
                                stock ? <p className="text-gray-700 font-bold">In Stock</p>
                                    :
                                    <p className="text-gray-700">Out of Stock</p>
                            }
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to={`/proceed/${id}`}><button className="bg-green-500 flex items-center gap-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ">
                            Proceed <span><FaArrowAltCircleRight></FaArrowAltCircleRight></span>
                        </button></Link>
                    </div>
                </div>
            </div>
            <h1 className="text-center text-4xl font-bold my-5">Images</h1>
            <div className="grid grid-cols-2 gap-4">
                {
                    images.map((image, index) => (
                        <img key={index} className="w-fit border-2" src={image} alt={`${title} - ${index + 1}`} />
                    ))
                }
            </div>
        </div>
    );
};

export default ProductDetails;
