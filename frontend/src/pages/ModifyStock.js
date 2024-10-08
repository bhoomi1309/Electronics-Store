import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { fetchElectronicsData, editElectronics, addElectronics } from './API';
import Swal from 'sweetalert2';

function ModifyStock() {

    const { id } = useParams();
    const [state, setState] = useState({
        arr: [],
        available: 0,
        costPrice: 0,
        id: -1,
        selectedItem: '',
        addOrDelete: 'Add',
        addNewItem: false,
        newItemName: '',
        newItemCount: '',
        newItemCostPrice: '',
        length: 0
    });

    const addButtonRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchElectronicsData()
            .then(res => {
                setState(prev => ({ ...prev, arr: res, length: res.length }));
                const selectedItemData = res.find(item => item.No === parseInt(id));
                if (selectedItemData) {
                    setState(prev => ({
                        ...prev,
                        selectedItem: selectedItemData.Item,
                        id: selectedItemData.No,
                        newItemName: selectedItemData.Item,
                        newItemCostPrice: selectedItemData.CostPrice,
                        available: selectedItemData.Available,
                        costPrice: selectedItemData.CostPrice,
                    }));
                }
            })

    }, [id]);

    const handleItemChange = (e) => {
        const selectedItem = e.target.value;
        const selectedItemData = state.arr.find((item) => item.Item === selectedItem);

        if (selectedItemData) {
            setState(prev => ({
                ...prev,
                selectedItem,
                id: selectedItemData.No,
                newItemName: selectedItemData.Item,
                newItemCostPrice: selectedItemData.CostPrice,
                available: selectedItemData.Available,
                costPrice: selectedItemData.CostPrice,
            }));
            navigate('/modifyStock/' + selectedItemData.No);
        }
        else {
            setState(prev => ({
                ...prev,
                selectedItem: '',
                id: -1,
                available: 0,
                costPrice: 0
            }));
            navigate('/modifyStock');
        }
    };

    const toggleNewItem = () => {
        setState(prev => ({
            ...prev,
            addNewItem: !prev.addNewItem,
            selectedItem: '',
            available: 0,
            costPrice: 0,
            newItemName: '',
            newItemCount: '',
            newItemCostPrice: '',
            addOrDelete: 'Add',
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (addButtonRef.current && !(state.selectedItem === '' && !state.addNewItem)) {
                addButtonRef.current.click();
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (state.addNewItem && (state.newItemName === '' ||  state.newItemCostPrice === '')) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in all the fields for the new item!",
            });
            return;
        }

        if (state.selectedItem === '') {
            const stockData = {
                No: state.length ? state.length + 1 : 1,
                Item: state.newItemName,
                Available: parseInt(state.newItemCount || 0),
                CostPrice: parseInt(state.newItemCostPrice)
            };
            addElectronics(stockData, navigate);
            Swal.fire({
                icon: "success",
                title: "Item Added!",
                text: 'The item '+state.newItemName+' has been added successfully!',
            });
        }
        else {
            if (state.newItemName === '' || state.newItemCostPrice === '') {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please fill in all the fields for the item to be modified!",
                });
                return;
            }
            const stockData = {
                Item: state.newItemName,
                Available: state.addOrDelete === 'Add' ?
                    parseInt(state.newItemCount || 0) + state.available:
                    state.available - parseInt(state.newItemCount || 0),
                CostPrice: parseInt(state.newItemCostPrice)
            };
            if (stockData.Available < 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Stock cannot be less than 0!",
                });
                return;
            }
            editElectronics(stockData, state.id, navigate);
            Swal.fire({
                icon: "success",
                title: "Item Modified!",
                text: 'The item '+state.newItemName+' has been modified successfully!',
            });
        }
    };

    const isButtonDisabled = !state.selectedItem && !state.addNewItem;

    return (
        <>
            <div className='container text-center d-block'>
                <div className='row'>
                    <div className='col'>
                        <h1 style={{ paddingTop: "20px", paddingBottom: "25px", fontSize: "50px" }}>Modify your Stock!</h1>
                    </div>
                </div>
                <div className='row justify-content-center text-white'>
                    <div className='col-lg-6 shadow rounded-4 p-3' style={{ backgroundColor: "#9e0671" }}>
                        <form onKeyDown={handleKeyPress}>
                            <div className='d-flex m-3 justify-content-center'>
                                <label className='fs-4 me-3 align-top'>Item: </label>
                                <select value={state.selectedItem}
                                    onChange={handleItemChange}
                                    className='form-select p-2 bg-light w-50'
                                    role="button"
                                    disabled={state.addNewItem}>
                                    <option value=''>Select any item!</option>
                                    {state.arr.map((item, index) => (
                                        <option key={index} value={item.Item}>
                                            {item.Item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='text-start ms-3' style={{ float: "left" }}>
                                <label>Available</label>
                                <div className='text-center fs-3'>{state.available}</div>
                            </div>
                            <div className='text-end me-3' style={{ float: "right" }}>
                                <label>Cost Price</label>
                                <div className='text-center fs-3'>{state.costPrice}</div>
                            </div>
                            <div className="btn-group btnAddDelete" role="group" style={{ marginTop: "80px" }}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="btnradio"
                                    id="Add"
                                    onChange={() => setState(prev => ({ ...prev, addOrDelete: 'Add' }))}
                                    checked={state.addOrDelete === 'Add'}
                                    disabled={isButtonDisabled}
                                />
                                <label
                                    className="btn btn-outline-success px-4 border-3"
                                    style={{ color: 'white' }}
                                    htmlFor="Add"
                                >Add
                                </label>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="btnradio"
                                    id="Delete"
                                    onChange={() => setState(prev => ({ ...prev, addOrDelete: 'Delete' }))}
                                    checked={state.addOrDelete === 'Delete'}
                                    disabled={isButtonDisabled || state.addNewItem}
                                />
                                <label
                                    className="btn btn-outline-danger px-3 border-3"
                                    style={{ color: 'white' }}
                                    htmlFor="Delete"
                                >Delete
                                </label>
                            </div>
                            <div className='mt-4'>
                                <table className='m-auto w-60 user-select-none'>
                                    <tbody>
                                        <tr className='stockAdd'>
                                            <td className='text-start py-1'>
                                                <label className='fs-5 me-3 align-middle'>Item: </label>
                                            </td>
                                            <td>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    disabled={isButtonDisabled}
                                                    value={state.newItemName}
                                                    onChange={(e) => setState(prev => ({ ...prev, newItemName: e.target.value }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='stockAdd'>
                                            <td className='text-start py-1'>
                                                <label className='fs-5 me-3 align-middle'>No. of items to {state.addOrDelete}: </label>
                                            </td>
                                            <td>
                                                <input
                                                    type='number'
                                                    className='form-control my-1'
                                                    disabled={isButtonDisabled}
                                                    value={state.newItemCount}
                                                    onChange={(e) => setState(prev => ({ ...prev, newItemCount: e.target.value }))}
                                                />
                                            </td>
                                        </tr>
                                        <tr className='stockAdd'>
                                            <td className='text-start py-1'>
                                                <label className='fs-5 me-3 align-middle'>Cost Price: </label>
                                            </td>
                                            <td>
                                                <input
                                                    type='number'
                                                    className='form-control'
                                                    disabled={isButtonDisabled}
                                                    value={state.newItemCostPrice}
                                                    onChange={(e) => setState(prev => ({ ...prev, newItemCostPrice: e.target.value }))}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='m-4'>
                                <button className='btn btn-primary px-4'
                                    disabled={isButtonDisabled}
                                    ref={addButtonRef}
                                    onClick={handleFormSubmit}>
                                    {state.addOrDelete}
                                </button>
                            </div>
                        </form>
                        <div className='text-center my-4'>
                            <button className='btn btn-secondary' onClick={toggleNewItem}>
                                {state.addNewItem ? 'Update Existing Item' : 'Add New Item'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModifyStock;
