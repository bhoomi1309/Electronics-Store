import './style.css';
import { useState, useEffect, useRef } from 'react';
import { fetchElectronicsData, addBill, updateElectronicsStock } from './API';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Bill(){

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = day + '-' + month + '-' + year;

    const [date, setDate] = useState('');
    const [CustomerName, setCustomerName] = useState('');

    const { No } = useParams();
    const [rows, setRows] = useState([
        {   No: No || '', 
            Item: '', 
            CostPrice: '', 
            Quantity: '', 
            SellPrice: '', 
            Amount: '', 
            Profit: '' 
        }
    ]);

    const navigate=useNavigate();

    const [arr, setArr] = useState([]);

    const customerNameInputRef = useRef(null);

    useEffect(() => {
        fetchElectronicsData()
            .then(res => setArr(res));
        setDate(formattedDate);
        customerNameInputRef.current.focus();
    }, [formattedDate]);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;

        const quantity = updatedRows[index].Quantity || 0;
        const sellPrice = updatedRows[index].SellPrice || 0;
        const costPrice = updatedRows[index].CostPrice || 0;

        updatedRows[index].Amount = sellPrice * quantity;
        updatedRows[index].Profit = (sellPrice - costPrice) * quantity;

        setRows(updatedRows);
    };

    const handleItemChange = (index, e) => {
        const selectedItem = e.target.value;
        const selectedItemData = arr.find((item) => item.Item === selectedItem);
    
        if(selectedItemData){
            const updatedRows = [...rows];
            updatedRows[index].Item = selectedItem;
            updatedRows[index].CostPrice = selectedItemData.CostPrice;
            setRows(updatedRows);
        } 
        else{
            console.warn("Invalid item selected");
        }
    };
    
    const addRow = () => {
        if (allFieldsFilled()) {
            setRows([...rows, { Item: '', 
                                CostPrice: '', 
                                Quantity: '', 
                                SellPrice: '', 
                                Amount: '', 
                                Profit: '', 
                                isInvalid: false 
                            }
                    ]);
        }
        else {
            const updatedRows = [...rows];
            updatedRows[rows.length - 1].isInvalid = true;
            setRows(updatedRows);
        }
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (allFieldsFilled()) {
                    addRow();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [rows]);

    const allFieldsFilled = () => {
        const lastRow = rows[rows.length - 1];
        return lastRow.Item && lastRow.Quantity && lastRow.SellPrice;
    };

    const isLastRowInvalid = !allFieldsFilled();

    const totalQuantity = rows.reduce((acc, row) => acc + (parseInt(row.Quantity) || 0), 0);
    const totalAmount = rows.reduce((acc, row) => acc + (parseFloat(row.Amount) || 0), 0);
    const totalProfit = rows.reduce((acc, row) => acc + (parseFloat(row.Profit) || 0), 0);

    const saveBill = async () => {
        if (CustomerName && totalAmount > 0) {
            const validItems = rows.filter(row => row.Item && row.Quantity && row.SellPrice);
            if (validItems.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter at least one valid item!",
                });
                return;
            }
            for (let i = 0; i < validItems.length; i++) {
                const itemName = validItems[i].Item;
                const soldQuantity = validItems[i].Quantity;
    
                const itemData = arr.find(item => item.Item === itemName);
                if (itemData) {
                    const newStock = itemData.Available - soldQuantity;
    
                    if (newStock < 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: 'Not enough stock for '+itemData.Item+'!',
                        });
                        return;
                    }
                }
            }
    
            const ItemNames = validItems.map(row => row.Item);
            const Quantities = validItems.map(row => row.Quantity);
            const Price = validItems.map(row => row.SellPrice);
    
            const billData = { 
                No,
                date, 
                CustomerName, 
                ItemNames, 
                Quantities, 
                Price,
                Amount: parseFloat(totalAmount),
                Profit: parseInt(totalProfit)
            };
    
            addBill(billData, navigate);
    
            for (let i = 0; i < validItems.length; i++) {
                const itemName = validItems[i].Item;
                const soldQuantity = validItems[i].Quantity;
                const itemData = arr.find(item => item.Item === itemName);
                if (itemData) {
                    const newStock = itemData.Available - soldQuantity;
                    const stockData = {
                        Item: itemData.ItemName,
                        Available: newStock,
                        CostPrice: parseInt(itemData.CostPrice)
                    };
                    updateElectronicsStock(stockData, itemData.No);
                }
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in the customer name and ensure the bill has at least one valid item.",
            });
        }
    };
    

    return(            
        <>
            <h1 className='text-center m-4' style={{ fontSize:"50px" }}>Bill</h1>
            <div className='container-fluid px-4'>
                <div className='row my-3'>
                    <div className='col'>Date: 
                        <span className='fw-bold fst-italic ms-1'>{formattedDate}</span>
                    </div>
                </div>
                <div className='row my-3'>
                    <div className='col'>Number: 
                        <span className='fw-bold fst-italic ms-1'>{No}</span>
                    </div>
                </div>
                <div className='row my-3 fs-5'>
                    <div className='col-lg-6 d-flex align-items-center'>
                        Customer Name: 
                            <span className='ms-2'>
                                <input 
                                    type="text" 
                                    ref={customerNameInputRef}
                                    className="form-control" 
                                    value={CustomerName}
                                    onChange={(e) => setCustomerName(e.target.value)} 
                                />
                            </span>
                    </div>
                </div>
                <div className='row'>
                    <div className='col table-responsive'>
                        <table className='table table-bordered text-center'>
                            <thead className='table-secondary' style={{fontSize:"17px"}}>
                                <tr>
                                    <th style={{ width: "3vw" }}>No.</th>
                                    <th style={{ width: "29vw" }}>Item</th>
                                    <th style={{ width: "10vw" }}>Cost Price</th>
                                    <th style={{ width: "5vw" }}>Quantity</th>
                                    <th style={{ width: "10vw" }}>Sell Price</th>
                                    <th style={{ width: "15vw" }}>Profit</th>
                                    <th style={{ width: "15vw" }}>Amount</th>
                                    <th style={{ width: "5vw" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className='align-middle'>
                                {rows.map((row, index) => (
                                    <tr key={row.No + '-' + index}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            <select
                                                style={{ width: "100%" }}
                                                value={row.Item}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className={'p-2 bg-light ' + (row.isInvalid && !row.Item ? "invalid_input" : "")}
                                                role="button"
                                            >
                                                <option value=''>Select any item!</option>
                                                {arr.map((item,idx) => (
                                                    <option key={idx} value={item.Item}>
                                                        {item.Item}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            {row.CostPrice}
                                        </td>
                                        <td>
                                            <input
                                                type='number'
                                                name='Quantity'
                                                value={row.Quantity}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className={'form-control ' + (row.isInvalid && !row.Quantity ? "invalid-input" : "")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='number'
                                                name='SellPrice'
                                                value={row.SellPrice}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className={'form-control ' + (row.isInvalid && !row.SellPrice ? "invalid-input" : "")}
                                            />
                                        </td>
                                        <td>
                                            {row.Profit}
                                        </td>
                                        <td>
                                            {row.Amount}
                                        </td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => handleDeleteRow(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className='fs-5 text-center'>
                                    <td colSpan="3" className='text-start px-3'><strong>Total:</strong></td>
                                    <td><strong>{totalQuantity}</strong></td>
                                    <td></td>
                                    <td><strong>{totalProfit.toFixed(2)}</strong></td>
                                    <td><strong>{totalAmount.toFixed(2)}</strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center'>
                        <button className='btn btn-primary' onClick={addRow} disabled={isLastRowInvalid}>
                            Add New Row
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col text-center my-3'>
                        <button 
                            className='btn btn-success btn-lg' 
                            disabled={isLastRowInvalid} 
                            onClick={saveBill}
                        >Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Bill;