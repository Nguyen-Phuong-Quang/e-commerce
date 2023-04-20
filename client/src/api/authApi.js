import axiosClient from "./axiosClient";

const PREFIX = "/auth";

const authApi = {
    signin: (data) => {
        const url = `${PREFIX}/sign-in`;
        return axiosClient.post(url, data);
    },
    signup: (data) => {
        const url = `${PREFIX}/sign-up`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    signout: () => {
        const url = `${PREFIX}/sign-out`;
        return axiosClient.post(url);
    },
};

export default authApi;
