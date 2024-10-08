import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBillData, deleteBill, getBillById, renumberBills, updateElectronics, fetchElectronicsData } from './API';
import Swal from 'sweetalert2';
import './style.css';

function Sales() {

    const [arr, setArr] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchBillData()
            .then(res => setArr(res));
    }, []);

    const [electronics, setElectronics] = useState([]);
    useEffect(() => {
        fetchElectronicsData()
            .then(res => setElectronics(res));
    }, []);

    const navigate = useNavigate();

    const addRow = () => {
        const billNo = arr.length + 1;
        navigate('/sales/bill/' + billNo);
    };

    const handleDeleteRow = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to retrieve the Bill " + id + " back!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const billData = await getBillById(id);
                    if (!billData) {
                        alert('Bill not found.');
                        return;
                    }

                    for (let i = 0; i < billData.ItemNames.length; i++) {
                        const itemName = billData.ItemNames[i];
                        const soldQuantity = parseInt(billData.Quantities[i]);
                        const itemData = electronics.find(item => item.Item === itemName);
                        if (itemData) {
                            const newStock = itemData.Available + soldQuantity;
                            const stockData = {
                                Item: itemData.Item,
                                Available: newStock,
                                CostPrice: parseInt(itemData.CostPrice)
                            };
                            updateElectronics(stockData, itemData.No);
                        }
                    }
                    await deleteBill(id, navigate);
                    await renumberBills(id);
                    const updatedArr = await fetchBillData();
                    setArr(updatedArr)
                        Swal.fire({
                            icon: "success",
                            title: "Bill Deleted!",
                            text: 'The Bill No: '+id+' has been deleted successfully!',
                        })
                }
            })
    };

    const handleRowClick = async (id) => {
        await getBillById(id);
        navigate('/sales/' + id);
    };

    const filteredBills = selectedDate
        ? arr.filter(row => {
            let dateParts = row.date.split('-');
            let formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
            return formattedDate === selectedDate;
        })
        : arr;

    const totalAmount = filteredBills.reduce((acc, row) => acc + (parseFloat(row.Amount) || 0), 0);
    const totalProfit = filteredBills.reduce((acc, row) => acc + (parseFloat(row.Profit) || 0), 0);

    return (
        <>
            <h1
                className='text-center m-4'
                style={{fontSize: "50px"}}
            >Sales</h1>
            <div className='container-fluid px-4'>
                <div className='row'>
                    <div className='col mt-2 mb-4 mx-1 fs-5'>
                        Date:
                        <span className='ms-2 align-middle'>
                            <input
                                type='date'
                                className='form-control d-inline-block w-auto'
                                style={{cursor: "pointer"}}
                                value={selectedDate || ''}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </span>
                        <button
                            className='btn btn-warning ms-2 btnClear'
                            onClick={() => setSelectedDate(null)}
                        >
                            Clear Date
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col table-responsive'>
                        <table 
                            className='table table-striped table-hover table-bordered text-center tableSales'
                            style={{borderRadius: "8px", overflow: "hidden"}}
                        >
                            <thead>
                                <tr>
                                    <th style={{ width: "3vw" }}>No.</th>
                                    <th style={{ width: "5vw" }}>Date</th>
                                    <th className='text-start' style={{ width: "29vw" }}>Customer</th>
                                    <th style={{ width: "10vw" }}>Profit</th>
                                    <th style={{ width: "10vw" }}>Amount</th>
                                    <th style={{ width: "5vw" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className='align-middle'>
                                {filteredBills.map((row, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRowClick(row.No)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {row.date}
                                        </td>
                                        <td className='text-start'>
                                            {row.CustomerName}
                                        </td>
                                        <td className='text-end pe-4'>
                                            {row.Profit}
                                        </td>
                                        <td className='text-end pe-4'>
                                            {row.Amount}
                                        </td>
                                        <td>
                                            <button className='btn btn-outline-danger border-2 fw-bold' onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRow(row.No);
                                            }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className='fs-5 text-center'>
                                    <td colSpan="3" className='text-start px-3'><strong>Total:</strong></td>
                                    <td className='text-end pe-4'><strong>{totalProfit}</strong></td>
                                    <td className='text-end pe-4'><strong>{totalAmount}</strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center mb-5'>
                        <button className='btn btn-primary' onClick={addRow}>
                            Add New Bill
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sales;