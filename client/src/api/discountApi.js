import axiosClient from "./axiosClient";

const PREFIX = "/discount";

const discountApi = {
    generate: (data) => {
        const url = `${PREFIX}/generate`;
        return axiosClient.post(url, data);
    },
};

export default discountApi;
