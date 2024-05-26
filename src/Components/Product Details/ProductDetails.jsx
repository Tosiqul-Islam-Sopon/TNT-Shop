import { useContext, useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import useOffer from "../Hooks/useOffer";

const ProductDetails = () => {
    const product = useLoaderData();
    const [isAdmin, setAdmin] = useState(false);

    const { _id, title, description, price, discountPercentage, rating, brand, thumbnail, images, stock, specialDiscount } = product;

    const { type = null, freeProductThreshold = null, discountThreshold = null, discountAmount = null } = specialDiscount || {};

    const { user } = useContext(AuthContext);
    const globalOfferPercent = useOffer();

    useEffect(() => {
        setAdmin(user && user?.email === "tnt.shop@gmail.com" ? true : false);
    }, [user]);

    
    return (
        <div className="max-w-4xl mx-auto mt-8">
            {
                globalOfferPercent>0 && <>
                    <div className="text-center mb-5">
                        <p className="text-red-500">You get special 30% off for your current purchase</p>
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


                    {
                        (specialDiscount && type === "freeProduct") && (
                            <div className="border-t-2 py-3">
                                <p className="text-gray-700 "><span className="font-bold">Special Discount: </span> <span className="text-red-500">Buy {freeProductThreshold} and get 1 free</span></p>
                            </div>
                        )
                    }
                    {
                        (specialDiscount && type === "percentageDiscount") && <>
                            <div className="border-t-2 py-3">
                                <p className="text-gray-700 "><span className="font-bold">Special Discount: </span> <span className="text-red-500">Buy {discountThreshold} and get {discountAmount}% off</span></p>
                            </div>
                        </>
                    }
                    

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
                        {
                            isAdmin ? <>
                                <Link to={`/updateProduct/${_id}`}><button className="bg-green-500 flex items-center gap-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ">
                                    Update
                                </button></Link>
                            </>
                                :
                                <>
                                    <Link to={`/proceed/${_id}`}><button className="bg-green-500 flex items-center gap-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ">
                                        Proceed <span><FaArrowAltCircleRight></FaArrowAltCircleRight></span>
                                    </button></Link>
                                </>
                        }

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
