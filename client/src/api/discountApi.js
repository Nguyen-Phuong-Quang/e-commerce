import axiosClient from "./axiosClient";

const PREFIX = "/discount";

const discountApi = {
    getAllDiscount: (minOrderValue = Number.MAX_SAFE_INTEGER) => {
        const url = `${PREFIX}`;
        return axiosClient.get(url, {
            params: {
                minOrderValue,
            },
        });
    },

    addDiscount: (discount) => {
        const url = `${PREFIX}/generate`;
        return axiosClient.post(url, discount);
    },

    deleteDiscount: (discountId) => {
        const url = `${PREFIX}/delete/${discountId}`;
        return axiosClient.delete(url);
    },

    verifyDiscount: (discountId) => {
        const url = `${PREFIX}/verify/${discountId}`;
        return axiosClient.post(url);
    },
};

export default discountApi;
