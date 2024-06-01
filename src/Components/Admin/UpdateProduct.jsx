import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";

const UpdateProduct = () => {
    const { id } = useParams();
    const product = useLoaderData();
    const navigate = useNavigate();

    const { title, description, price, discountPercentage, brand, thumbnail, images, stock, specialDiscount } = product;

    const [specialDiscountType, setSpecialDiscountType] = useState(specialDiscount?.type || '');
    const [freeProductThreshold, setFreeProductThreshold] = useState(specialDiscount?.freeProductThreshold || '');
    const [discountThreshold, setDiscountThreshold] = useState(specialDiscount?.discountThreshold || '');
    const [discountAmount, setDiscountAmount] = useState(specialDiscount?.discountAmount || '');
    const [startDate, setStartDate] = useState(specialDiscount?.startDate || '');
    const [endDate, setEndDate] = useState(specialDiscount?.endDate || '');
    const [freeProductCount, setFreeProductCount] = useState(specialDiscount?.freeProductCount || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const price = parseFloat(form.price.value);
        const discountPercentage = parseFloat(form.discountPercentage.value);
        const brand = form.brand.value;
        const thumbnail = form.thumbnail.value;
        const img1 = form.img1.value;
        const img2 = form.img2.value;
        const stock = parseInt(form.stock.value);

        const specialDiscount = specialDiscountType === '' ? null : {
            type: specialDiscountType,
            freeProductThreshold: specialDiscountType === 'freeProduct' ? parseInt(freeProductThreshold, 10) : null,
            discountThreshold: specialDiscountType === 'percentageDiscount' ? parseInt(discountThreshold, 10) : null,
            discountAmount: specialDiscountType === 'percentageDiscount' ? parseFloat(discountAmount) : null,
            freeProductCount: specialDiscountType === 'freeProduct' ? parseInt(freeProductCount, 10) : null,
            startDate,
            endDate
        };

        const updateProduct = {
            title, description, price, discountPercentage, brand, thumbnail, images: [img1, img2], stock, specialDiscount
        };
        // console.log(updateProduct);

        try {
            const response = await axios.patch(`http://localhost:5000/updateProduct/${id}`, updateProduct);

            if (response.data.modifiedCount) {
                alert("Product updated successfully");
                navigate(`/product/${id}`);
            } else {
                alert("Product update failed or no changes made");
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6">Update Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={title}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={description}
                        className="w-full px-3 py-2 border rounded"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        id="price"
                        name="price"
                        defaultValue={price}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPercentage">
                        Discount Percentage
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        id="discountPercentage"
                        name="discountPercentage"
                        defaultValue={discountPercentage}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                        Brand
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        defaultValue={brand}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                        Thumbnail URL
                    </label>
                    <input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        defaultValue={thumbnail}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                        Image 1
                    </label>
                    <input
                        type="text"
                        name="img1"
                        defaultValue={images[0]}
                        className="w-full px-3 py-2 border rounded mb-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                        Image 2
                    </label>
                    <input
                        type="text"
                        name="img2"
                        defaultValue={images[1]}
                        className="w-full px-3 py-2 border rounded mb-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                        Stock
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        defaultValue={stock}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialDiscountType">
                        Special Discount Type
                    </label>
                    <select
                        id="specialDiscountType"
                        name="specialDiscountType"
                        value={specialDiscountType}
                        onChange={(e) => setSpecialDiscountType(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="">None</option>
                        <option value="freeProduct">Free Product</option>
                        <option value="percentageDiscount">Percentage Discount</option>
                    </select>
                </div>

                {specialDiscountType === 'freeProduct' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="freeProductThreshold">
                                Free Product Threshold
                            </label>
                            <input
                                type="number"
                                id="freeProductThreshold"
                                name="freeProductThreshold"
                                value={freeProductThreshold}
                                onChange={(e) => setFreeProductThreshold(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="freeProductCount">
                                Number of Free Products
                            </label>
                            <input
                                type="number"
                                id="freeProductCount"
                                name="freeProductCount"
                                value={freeProductCount}
                                onChange={(e) => setFreeProductCount(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </>
                )}

                {specialDiscountType === 'percentageDiscount' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountThreshold">
                                Discount Threshold
                            </label>
                            <input
                                type="number"
                                id="discountThreshold"
                                name="discountThreshold"
                                value={discountThreshold}
                                onChange={(e) => setDiscountThreshold(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountAmount">
                                Discount Amount (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="discountAmount"
                                name="discountAmount"
                                value={discountAmount}
                                onChange={(e) => setDiscountAmount(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </>
                )}

                {specialDiscountType !== "" && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
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
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </>
                )}

                <div className="flex items-center justify-between mb-5">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;
