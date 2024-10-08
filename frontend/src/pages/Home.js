import './style.css';
import { Link } from 'react-router-dom';
function Home() {
    return (
        <>
            <div className='bgImg'>
                <div className='head'>
                    <h1 id='deHome'>Dariyalal Electronics</h1>
                </div>
                <div className='buttonDiv' style={{ float: "left" }}>
                    <Link to='/sales'>
                        <button className='button'>
                            <span>Sales</span>
                        </button>
                    </Link>
                </div>
                <div className='buttonDiv'>
                    <Link to='/stock'>
                        <button className='button'>
                            <span>Available Stock</span>
                        </button>
                    </Link>
                </div>
                <div className='buttonDiv button3'>
                    <Link to='/modifyStock'>
                        <button className='button'>
                            <span>Modify Stock</span>
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Home;