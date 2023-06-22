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

    getSellerProducts: (name) => {
        const url = `${PREFIX}/seller-product`;
        return axiosClient.get(url, {
            params: {
                name,
            },
        });
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
        return axiosClient.patch(url, data);
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
    addColor: (productId, color) => {
        const url = `${PREFIX}/color/${productId}`;
        return axiosClient.post(url, { color });
    },
    deleteColor: (productId, color) => {
        const url = `${PREFIX}/color/${productId}`;
        return axiosClient.delete(url, {
            params: {
                color,
            },
        });
    },
    addSize: (productId, size) => {
        const url = `${PREFIX}/size/${productId}`;
        return axiosClient.post(url, { size });
    },
    deleteSize: (productId, size) => {
        const url = `${PREFIX}/size/${productId}`;
        return axiosClient.delete(url, {
            params: {
                size,
            },
        });
    },
};

export default productApi;
