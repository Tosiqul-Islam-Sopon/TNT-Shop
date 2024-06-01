import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/notifications/${user.email}`)
                .then(res => {
                    const sortedNotifications = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setNotifications(sortedNotifications);
                })
                .catch(err => console.error(err));

            axios.get(`http://localhost:5000/unseenNotifications/${user.email}`)
                .then(async (res) => {
                    const value = res.data;
                    for (let i = 0; i < value.length; i++) {
                        await axios.patch(`http://localhost:5000/notification/${value[i]._id}`);
                    }
                });
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div key={notification._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <h2 className="text-xl font-semibold mb-2">Notification Date: {new Date(notification.date).toLocaleString()}</h2>
                        <p className="mb-4"><strong>Total Cash Back:</strong> ${notification.cashBack.toFixed(2)}</p>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Items:</h3>
                            <ul className="list-disc list-inside">
                                {notification.items.map((item, index) => (
                                    <li key={index} className="bg-gray-100 rounded p-2 mb-2">
                                        <p><strong>Title:</strong> {item.title}</p>
                                        <p><strong>Taken Quantity:</strong> {item.takenQuantity}</p>
                                        <p><strong>Cash Back:</strong> ${item.cashBack.toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
};

export default Notifications;
