import axiosClient from "./axiosClient";

const PREFIX = "/product";

const productApi = {
    getAllProduct: (name = "") => {
        const url = `${PREFIX}`;
        return axiosClient.get(url, {
            params: {
                name,
            },
        });
    },

    // getProductStatics: () => {
    //     const url = `${PREFIX}/seller-product`;
    //     return axiosClient.get(url);
    // },

    getSellerProducts: (userId) => {
        const url = `${PREFIX}/seller-product`;
        return axiosClient.get(url, userId);
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
    updateProductDetail: (productId, data) => {
        const url = `${PREFIX}/update-product-detail/${productId}`;
        return axiosClient.patch(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateProductImages: (productId, data) => {
        const url = `${PREFIX}/update-product-images/${productId}`;
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
