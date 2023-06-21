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
    deleteItemInCart: (productId, size, color) => {
        const url = `${PREFIX}/${productId}`;
        return axiosClient.delete(url, {
            params: {
                size,
                color,
            },
        });
    },

    decreaseOne: (productId, sizeId, colorId) => {
        const url = `${PREFIX}/decrease-one/${productId}/${sizeId}/${colorId}`;
        return axiosClient.patch(url);
    },

    increaseOne: (productId, sizeId, colorId) => {
        const url = `${PREFIX}/increase-one/${productId}/${sizeId}/${colorId}`;
        return axiosClient.patch(url);
    },
};

export default cartApi;
