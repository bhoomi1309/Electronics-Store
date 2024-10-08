import './style.css';
import { getBillById } from './API';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
function Bill_id() {
    const { id } = useParams();
    const [bill, setBill] = useState({
        date: '',
        No: 0,
        CustomerName: '',
        ItemNames: [],
        Quantities: [],
        Price: [],
        Amount: 0
    });
    useEffect(() => {
        getBillById(id)
            .then(bill => {
                setBill(bill)
            });
    }, [id]);

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col my-1 mx-4 p-2'>
                        <Link to='/sales' className='fs-5 backToSales'>Back to Sales</Link>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <h1 className='text-center' style={{ fontSize: "50px" }}>Bill</h1>
                    </div>
                </div>
                <div className='row my-3 justify-content-center'>
                    <div className='col-lg-7 col-md-12'>
                        <div className='info-container d-flex justify-content-between align-items-center p-3'>
                            <div className='info-item text-center'>
                                <h6 className='fs-5 fw-bold'>Date</h6>
                                <p className='fs-6'>{bill.date}</p>
                            </div>
                            <div className='divider'></div>
                            <div className='info-item text-center'>
                                <h6 className='fs-5 fw-bold'>No.</h6>
                                <p className='fs-6'>{bill.No}</p>
                            </div>
                            <div className='divider'></div>
                            <div className='info-item text-center'>
                                <h6 className='fs-5 fw-bold'>Customer Name</h6>
                                <p className='fs-6'>{bill.CustomerName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container d-flex justify-content-center align-items-center'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='table-responsive'>
                            <table className='table table-hover table-bordered text-center custom-table'>
                                <thead>
                                    <tr>
                                        <th style={{ width: "3vw" }} className='noColumn'>No.</th>
                                        <th style={{ width: "33vw" }}>Item</th>
                                        <th style={{ width: "12vw" }}>Quantity</th>
                                        <th style={{ width: "12vw" }}>Price</th>
                                        <th style={{ width: "12vw" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bill.ItemNames.length > 0 ? (
                                        bill.ItemNames.map((itemName, index) => (
                                            <tr key={index}>
                                                <td className="noColumn">{index + 1}</td>
                                                <td>{itemName}</td>
                                                <td>{bill.Quantities[index]}</td>
                                                <td>{bill.Price[index]}</td>
                                                <td>{(bill.Quantities[index] * bill.Price[index])}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No items in the bill</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Bill_id;