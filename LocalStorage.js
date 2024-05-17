
const getStoredCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) return JSON.parse(storedCart);
    return [];
}


export { getStoredCart };