
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import image from '../../assets/Images/404.jpg'
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className='text-center'>
            <img src={image} className='w-1/3 mx-auto' alt="" />
            <div className='mx-auto w-fit'>
                <Link to={"/"}><button className='btn bg-[#FF0000] text-white flex items-center'><FaArrowAltCircleLeft></FaArrowAltCircleLeft> Home</button></Link>
            </div>
        </div>
    );
};

export default ErrorPage;