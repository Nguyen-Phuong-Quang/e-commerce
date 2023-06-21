import axiosClient from "./axiosClient";

const PREFIX = "/order";

const orderApi = {
    create: (data) => {
        const url = `${PREFIX}`;
        return axiosClient.post(url, data);
    },
    query: () => {
        const url = `${PREFIX}`;
        return axiosClient.get(url);
    },
    getById: (orderId) => {
        const url = `${PREFIX}/${orderId}`;
        return axiosClient.get(url);
    },
};

export default orderApi;
