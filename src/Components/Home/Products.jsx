import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const Products = ({ products }) => {
    console.log(products);
    return (
        <div className='mt-10'>
            <div className='grid grid-cols-3 gap-3'>
                {
                    products.map(product => <ProductCard
                        key={product.id}
                        product={product}
                    ></ProductCard>)
                }
            </div>
        </div>
    );
};

Products.propTypes = {
    products: PropTypes.array
};

export default Products;