import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { id, title, price, discountPercentage, rating, brand, thumbnail } = product;
    return (
        <div className="max-w-sm overflow-hidden shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-xl rounded-xl"> 
            <img className="w-full h-[200px]" src={thumbnail} alt={title} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-bold text-xl">${price}</span>
                    <span className="text-sm text-gray-600">({discountPercentage}% off)</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Rating: {rating}</span>
                    <span className="text-gray-700">Brand: {brand}</span>
                </div>
            </div>
            <div className="px-6 py-4">
                <Link to={`/product/${id}`}><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    View Details
                </button></Link>
            </div>
        </div>
    );
};

export default ProductCard;

ProductCard.propTypes = {
    product: PropTypes.array
};
