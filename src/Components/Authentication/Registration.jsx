import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import img from "../../assets/Images/register.jpg"
import { Link } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import Swal from "sweetalert2";

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { createUser, setNameAndPhoto, googleSignIn } = useContext(AuthContext);

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one capital letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one numeric character.";
        }
        return true;
    };


    const handleRegister = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const url = e.target.photo.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (validatePassword(password)) {
            createUser(email, password)
                .then(() => {
                    setNameAndPhoto(name, url)
                        .then(res => {
                            console.log(res);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Welcome to TNT Shop",
                                text: "Registration Successfully",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            // navigate(location?.state ? location.state : "/");
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
                .catch(error => {

                    Swal.fire({
                        title: "Sorry!",
                        text: `${error.message}`,
                        icon: "error"
                    });

                })
        }
        else {
            Swal.fire({
                title: "Sorry!",
                text: "Please provide a password with at least 6 characters with one capital letter, one special character and one number",
                icon: "error"
            });
        }

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
        <div className="w-fit mx-auto">
            <div className="mx-auto my-8 lg:text-left text-center">
                <h1 className="text-3xl lg:text-5xl text-center font-bold">Sign up</h1>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-1">
                    <img src={img} alt="" />
                </div>
                <div className="flex-1 card shrink-0 rounded-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleRegister}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" placeholder="Name" name="name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="Email" name="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Photo URL</span>
                            </label>
                            <input type="text" placeholder="Photo URL" name="photo" className="input input-bordered" required />
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
                            <button className="btn bg-[#FF0000] text-white text-xl font-medium">Register</button>
                        </div>
                        <div className="flex flex-col mt-8 space-y-3 w-full justify-center items-center">
                            <p>Or Continue with</p>
                            <div className="space-x-6">
                                <button onClick={handleGoogleLogin} className="text-5xl"><FcGoogle /></button>
                            </div>
                        </div>
                        <div className="mx-auto mb-5">
                            <Link to="/login"><p>Already have an account? <span className="underline text-green-400">Login</span></p></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;