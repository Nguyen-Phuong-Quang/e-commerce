import axiosClient from "./axiosClient";

const baseUrl = "http://localhost:5001/api/v1";

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

    // Fix
    updateProductById: async (id, product) => {
        const response = await axiosClient.put(
            `${baseUrl}/products/${id}`,
            product,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response;
    },

    deleteProduct: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.delete(url);
    },


    // Fix
    getEvaluation: async () => {
        const response = await axiosClient.get(`${baseUrl}/products/reivews`);
        return response;
    },
};

export default productApi;
