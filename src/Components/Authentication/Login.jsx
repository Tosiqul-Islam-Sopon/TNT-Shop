import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import img from "../../assets/Images/login.jpg"
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../Providers/AuthProvider";
import Swal from "sweetalert2";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { logIn, googleSignIn } = useContext(AuthContext);

    const handleLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        // console.log(email, password);
        logIn(email, password)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome to TNT Shop",
                    text: "Login Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                Swal.fire({
                    title: "OPPS!!!",
                    text: `${error.message}`,
                    icon: "error"
                });
                // console.error(error.message);
            })
    }

    const handleGoogleLogin = () => {
        googleSignIn()
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome to TNT Shop",
                    text: "Login Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                
                // navigate(location?.state ? location.state : "/");
            })
            .catch(error => {
                
                Swal.fire({
                    title: "OPPS!!!",
                    text: `${error.message}`,
                    icon: "error"
                });
            })
    }
    return (
        <div className="w-fit  mx-auto">
            <div className="mx-auto my-8 lg:text-left text-center">
                <h1 className="text-3xl lg:text-5xl text-center font-bold">Login</h1>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-1">
                    <img src={img} alt="" />
                </div>
                <div className="flex-1 card shrink-0 rounded-2xl bg-base-100">

                    <form className="card-body" onSubmit={handleLogin}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="Email" name="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Password</span>
                                <span className="absolute bottom-4 right-3"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        showPassword ?
                                            <FaEye></FaEye>
                                            :
                                            <FaEyeSlash></FaEyeSlash>
                                    }
                                </span>
                            </label>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" className="input input-bordered" required />
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn bg-[#FF0000] text-white text-xl font-medium">Login</button>
                        </div>
                        <div className="flex flex-col mt-8 space-y-3 w-full justify-center items-center">
                            <p>Or Continue with</p>
                            <div className="space-x-6">
                                <button onClick={handleGoogleLogin} className="text-5xl"><FcGoogle /></button>
                            </div>
                        </div>
                        <div className="mx-auto mb-5">
                            <Link state={location?.state} to="/register"><p>Don&apos;t have an account? <span className="underline text-green-400">Register</span></p></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;