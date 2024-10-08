import './style.css';
import { useState, useEffect } from 'react';
import { fetchElectronicsData, deleteElectronics, renumberElectronics } from './API';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Stock() {

    const navigate = useNavigate();
    const [arr, setArr] = useState([]);
    useEffect(() => {
        fetchElectronicsData()
            .then(res => setArr(res));
    }, []);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = Array.isArray(arr) ? arr.filter(item =>
        item.Item.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const total = filteredData.reduce((acc, item) => {
        return acc + (item.CostPrice * item.Available);
    }, 0);

    const editButton = (id) => {
        navigate('/modifyStock/' + id);
    }

    const deleteButton = (id, name) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to retrieve the item '" + name + "' back!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await deleteElectronics(id);
                    await renumberElectronics(id);
                    const updatedArr = await fetchElectronicsData();
                    setArr(updatedArr);
                }
            })
            .then( res => {
                Swal.fire({
                    icon: "success",
                    title: "Item Deleted!",
                    text: 'The item '+name+' has been deleted successfully!',
                })
            });
    }

    return (
        <>
            <h1 className='text-center' style={{ paddingTop: "20px", paddingBottom: "6px", fontSize: "50px" }}>Dariyalal Electronics</h1>
            <div className='text-center my-4'>
                <div className="input-group" style={{ width: "100%", maxWidth: "450px", margin: "auto" }}>
                    <input
                        type="text"
                        className='form-control rounded-pill rounded-end border-0 bg-secondary searchBar'
                        placeholder='Search for an item...'
                        aria-label="Search"
                        style={{ color: "white", fontSize: "18px" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text bg-secondary border-0 rounded-start rounded-pill" id="basic-addon1">
                        <i className="bi bi-search text-white"></i>
                    </span>
                </div>
            </div>
            <div className='container d-flex justify-content-center align-items-center'>
                <div className='row justify-content-center'>
                    <div className='col'>
                        <div className='table-responsive'>
                            {filteredData.length > 0 ? (
                                <table border="1" className='table table-hover table-info table-bordered text-center'>
                                    <thead>
                                        <tr border="2">
                                            <th className='noColumn' style={{ width: "3vw" }}>No.</th>
                                            <th style={{ width: "28vw" }}>Item</th>
                                            <th style={{ width: "15vw" }}>Available</th>
                                            <th style={{ width: "15vw" }}>Cost Price</th>
                                            <th style={{ width: "20vw" }} colSpan={2}>Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td className='noColumn'>{index + 1}</td>
                                                <td>{item.Item}</td>
                                                <td>{item.Available}</td>
                                                <td>{item.CostPrice}</td>
                                                <td className='d-none d-md-table-cell'><button className='btn btn-warning' onClick={() => editButton(item.No)}>Edit</button></td>
                                                <td><button className='btn btn-danger' onClick={() => deleteButton(item.No, item.Item)}>Delete</button></td>
                                            </tr>
                                        ))}
                                        <tr className='fs-5'>
                                            <td colSpan="2"><strong>Total</strong></td>
                                            <td colSpan="2"><strong>{total}</strong></td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-dark fs-4 fw-bold">No items found!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Stock;