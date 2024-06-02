import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ReturnRequests = () => {

    const { data: requests = [], refetch } = useQuery({
        queryKey: ["returnRequests"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:5000/returnRequests");
            return res.data;
        }
    });

    const getPurchaseQuantity= async (purchaseId, itemId) => {
        const purchaseRes = await axios.get(`http://localhost:5000/purchase/${purchaseId}`)
        const { items } = purchaseRes.data;
        let purchaseQuantity = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId === itemId) {
                const {specialDiscount, quantity} = items[i];
                if (specialDiscount?.type === "freeProduct" && (quantity >= specialDiscount?.freeProductThreshold)){
                    purchaseQuantity = quantity - 1;
                }
                else    purchaseQuantity = quantity;
                break;
            }
        }
        return purchaseQuantity;
    }

    const handleTakeBackItems = async (itemId, quantity, purchaseId) => {
        // console.log({itemId, quantity, purchaseId});
        const productRes = await axios.get(`http://localhost:5000/product/${itemId}`);

        const { _id, price, discountPercentage, stock, specialDiscount } = productRes.data;
        let takeBackQuantity = quantity;
        const purchaseQuantity = await getPurchaseQuantity(purchaseId, itemId);

        if (specialDiscount?.type === "freeProduct" && (purchaseQuantity - quantity <= specialDiscount?.freeProductThreshold)) {
            takeBackQuantity += specialDiscount?.freeProductCount;
        }

        const updatedProduct = {
            ...productRes.data, stock: stock + takeBackQuantity
        };
         
        await axios.patch(`http://localhost:5000/updateProduct/${_id}`, updatedProduct);
        

        let cashBack = 0;

        if (specialDiscount?.type === "percentageDiscount" && purchaseQuantity >= specialDiscount?.discountThreshold) {
            if (purchaseQuantity - quantity <= specialDiscount?.discountThreshold) {
                const currentPrice = (price * (purchaseQuantity - quantity)) - (price * (purchaseQuantity - quantity) * (discountPercentage/100));
                const purchasePrice = (price * purchaseQuantity) -  (purchaseQuantity * price * ((discountPercentage+specialDiscount?.discountAmount)/100));
                cashBack = purchasePrice - currentPrice;

                console.log("case1->", cashBack);
            }
            else {
                cashBack = (price * quantity) - (quantity * price * ((discountPercentage+specialDiscount?.discountAmount)/100));
                console.log("case2->", cashBack);
            }
        }
        else{
            cashBack = (price * quantity) - (price * quantity * (discountPercentage/100));
            console.log("case3->", cashBack);
        }

        return [cashBack, takeBackQuantity];
    }

    const handleApprove = async (request) => {
        const {items, _id, userEmail} = request;
        const historyItems = [];
        const notificationItems = [];
        let totalCashBack = 0;

        const purchaseRes = await axios.get(`http://localhost:5000/purchase/${request.purchaseId}`)
        const { items: purchaseItems, total, date, _id: purchase_id } = purchaseRes.data;

        for (let i=0;i<purchaseItems.length;i++){
            let f = 0;
            for (let j=0;j<items.length;j++){
                if (purchaseItems[i].productId === items[j].productId){
                    f = 1;
                    break;
                }
            }
            if (!f){
                historyItems.push(purchaseItems[i]);
            }
        }

        for (let i = 0; i < items.length; i++) {
            const [cashBack, takeBackQuantity] = await handleTakeBackItems(items[i].productId, items[i].quantity, request.purchaseId);

            totalCashBack += cashBack;

            const item = purchaseItems.filter(item => item.productId === items[i].productId);

            const notiItem = {
                productId: items[i].productId,
                title: items[i].title,
                takenQuantity: takeBackQuantity,
                cashBack
            }

            notificationItems.push(notiItem);

            // console.log(item[0]);

            const {quantity: purchaseQuantity} = item[0];
            if (purchaseQuantity > takeBackQuantity){
                const newItem = {
                    ...item[0], quantity: purchaseQuantity - takeBackQuantity
                }
                historyItems.push(newItem);
            }
        }
        console.log("item->", historyItems);
        if (historyItems.length > 0){
            console.log("Fuck offfffffff");
            const newHistory = {
                items: historyItems,
                total: total - totalCashBack,
                date
            }
            await axios.patch(`http://localhost:5000/purchase/${purchase_id}`, newHistory);
        }
        else{
            await axios.delete(`http://localhost:5000/deletePurchase/${purchase_id}`);
        }

        const notification = {
            items: notificationItems,
            userEmail: userEmail,
            cashBack: totalCashBack,
            status: "unseen",
            date: new Date().toISOString()
        }

        const res = await axios.patch(`http://localhost:5000/approveReturn/${_id}`)
        if (res.data.modifiedCount){
            await axios.post("http://localhost:5000/notification", notification);
            refetch();
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-3xl font-semibold mb-4">Return Requests</h2>
            <div className="grid grid-cols-1 gap-4">
                {requests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4 shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Request ID: {request._id}</h3>
                        <p className="mb-2"><strong>User Email:</strong> {request.userEmail}</p>
                        <p className="mb-4"><strong>Return Request Date:</strong> {new Date(request.returnDate).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })}</p>
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <ul className="list-disc list-inside mb-4">
                            {request.items.map((item) => (
                                <li key={item.productId}>
                                    {item.title} - Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                        {request.status === "pending" && (
                            <button
                                onClick={() => handleApprove(request)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Approve
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReturnRequests;
