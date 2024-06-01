import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Components/Root/Root.jsx';
import Home from './Components/Home/Home.jsx';
import ErrorPage from './Components/Error Page/ErrorPage.jsx';
import AuthProvider from './Components/Providers/AuthProvider.jsx';
import Login from './Components/Authentication/Login.jsx';
import Registration from './Components/Authentication/Registration.jsx';
import ProductDetails from './Components/Product Details/ProductDetails.jsx';
import Proceed from './Components/Product Details/Proceed.jsx';
import Cart from './Components/Cart/Cart.jsx';
import PurchaseHistory from './Components/Purchase History/PurchaseHistory.jsx';
import UpdateProduct from './Components/Admin/UpdateProduct.jsx';
import Offers from './Components/Admin/Offers.jsx';
import EditOffer from './Components/Admin/EditOffer.jsx';
import ReturnProduct from './Components/ReturnProduct/ReturnProduct.jsx';
import ReturnRequests from './Components/Admin/ReturnRequests.jsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Notifications from './Components/Notifications/Notifications.jsx';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
        loader: () => fetch('http://localhost:5000/products')
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/register",
        element: <Registration></Registration>
      },
      {
        path: "/product/:id",
        element: <ProductDetails></ProductDetails>,
        loader: ({ params }) => fetch(`http://localhost:5000/product/${params.id}`)
      },
      {
        path: "/proceed/:id",
        element: <Proceed></Proceed>,
        loader: ({ params }) => fetch(`http://localhost:5000/product/${params.id}`)
      },
      {
        path: "/cart",
        element: <Cart></Cart>
      },
      {
        path: "/purchaseHistory",
        element: <PurchaseHistory></PurchaseHistory>
      },
      {
        path: "/notifications",
        element: <Notifications></Notifications>
      },

      // Admin routes

      {
        path: "/updateProduct/:id",
        element: <UpdateProduct></UpdateProduct>,
        loader: ({ params }) => fetch(`http://localhost:5000/product/${params.id}`)
      },
      {
        path: "/offers",
        element: <Offers></Offers>
      },
      {
        path: "/editOffer/:id",
        element: <EditOffer></EditOffer>
      },
      {
        path: "/returnProduct/:id",
        element: <ReturnProduct></ReturnProduct>
      },
      {
        path: "/returnRequests",
        element: <ReturnRequests></ReturnRequests>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className='max-w-screen-xl mx-auto'>
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)
