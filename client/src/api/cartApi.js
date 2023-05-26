import axiosClient from "./axiosClient";

const PREFIX = "/cart";

const cartApi = {
    add: (data) => {
        const url = `${PREFIX}`;
        return axiosClient.post(url, data);
    },
    getCart: () => {
        const url = `${PREFIX}`;
        return axiosClient.get(url);
    },
    deleteCurrentCart: () => {
        const url = `${PREFIX}`;
        return axiosClient.delete(url);
    },
    deleteItemInCart: (productId) => {
        const url = `${PREFIX}/${productId}`;
        return axiosClient.delete(url);
    },

    decreaseOne: (productId) => {
        const url = `${PREFIX}/decrease-one/${productId}`;
        return axiosClient.patch(url);
    },

    increaseOne: (productId) => {
        const url = `${PREFIX}/increase-one/${productId}`;
        return axiosClient.patch(url);
    },
};

export default cartApi;
