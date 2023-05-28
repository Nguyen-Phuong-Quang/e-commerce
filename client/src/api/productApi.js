import axiosClient from "./axiosClient";


const PREFIX = "/product";

const productApi = {
    getAllProduct: () => {
        const url = `${PREFIX}`;
        return axiosClient.get(url);
    },

    getProductById: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.get(url);
    },

    addProduct: (data) => {
        const url = `${PREFIX}`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateProductById: (id, data) => {
        const url = `${PREFIX}`;
        return axiosClient.put(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    
    updateMainImage: (data) => {
        const url = `${PREFIX}/update-mainImage`;
        return axiosClient.patch(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    deleteProduct: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.delete(url);
    },
};

export default productApi;
