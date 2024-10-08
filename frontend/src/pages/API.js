const apiStock = 'http://localhost:3001';
export const fetchElectronicsData = () => {
    const arr = fetch(apiStock + '/stock').then(res => res.json());
    return arr;
};
export const addElectronics = (data, navigate) => {
    fetch(apiStock + '/modifyStock', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            navigate('/stock', { state: { newItemId: res.No } });
        });
};
export const editElectronics = (data, id, navigate) => {
    fetch(apiStock + '/modifyStock/' + id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            navigate('/stock');
        });
};
export const updateElectronics = (data, id) => {
    fetch(apiStock + '/modifyStock/' + id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json());
};
export const deleteElectronics = async (id) => {
    fetch(apiStock + '/stock/' + id,
        { method: "DELETE" }
    )
        .then(res => res.json());
};
export const renumberElectronics = async (id) => {
    const response = await fetch(apiStock + '/stock/' + id, {
        method: 'POST',
        body: JSON.stringify({ deletedNo: id }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    return data;
};



const apiBill = 'http://localhost:3002';
export const fetchBillData = () => {
    const arr = fetch(apiBill + '/sales').then(res => res.json());
    return arr;
};
export const getBillById = async (id) => {
    const res = await fetch(apiBill + '/sales/' + id, { method: "GET" });
    const data = await res.json();
    return data;
};
export const addBill = (data, navigate) => {
    fetch(apiBill + '/sales/bill', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            navigate('/sales');
        });
};
export const deleteBill = async (id, navigate) => {
    fetch(apiBill + '/sales/' + id, { method: "DELETE" })
        .then(res => res.json())
        .then(res => {
            navigate('/sales');
        });
};
export const renumberBills = async (id) => {
    const response = await fetch(apiBill + '/sales/' + id, {
        method: 'POST',
        body: JSON.stringify({ deletedNo: id }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    return data;
};