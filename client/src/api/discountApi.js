import axiosClient from "./axiosClient";

const PREFIX = "/discount";

const discountApi = {
    getAllDiscount: () => {
        const url = `${PREFIX}`;
        return axiosClient.get(url);
    },

    getDiscountById: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.get(url);
    },

    addDiscount: (discount) => {
        const url = `${PREFIX}/generate`;
        return axiosClient.post(url, discount, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default discountApi;
