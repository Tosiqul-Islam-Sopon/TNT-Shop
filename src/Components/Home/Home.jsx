import { useLoaderData } from "react-router-dom";
import Products from "./Products";
import useOffer from "../Hooks/useOffer";
// import Support from "../Support/Support";

const Home = () => {
    const products = useLoaderData();
    const globalOfferPercent = useOffer();

    
    return (
        <div>
            {
                globalOfferPercent>0 && <>
                    <div className="text-center my-5">
                        <p className="text-red-500">You get special {globalOfferPercent} off for your current purchase</p>
                    </div>
                </>
            }
            <Products products={products}></Products>
        </div>
    );
};

export default Home;