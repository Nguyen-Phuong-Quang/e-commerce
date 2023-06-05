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
    verifyEmail: (data) => {
        const url = `${PREFIX}/verify-email`;
        return axiosClient.post(url, data);
    },
    signout: () => {
        const url = `${PREFIX}/sign-out`;
        return axiosClient.post(url);
    },
    changePassword: (data) => {
        const url = `${PREFIX}/change-password`;
        return axiosClient.post(url, data);
    }
};

export default authApi;
