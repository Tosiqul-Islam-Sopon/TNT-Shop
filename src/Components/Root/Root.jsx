import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Support from "../Support/Support";

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Support></Support>
        </div>
    );
};

export default Root;