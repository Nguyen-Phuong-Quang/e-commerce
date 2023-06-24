import axiosClient from "./axiosClient";

const PREFIX = "/user";

const authApi = {
    getUserById: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.get(url);
    },
    getUserByToken: () => {
        const url = `${PREFIX}/token`;
        return axiosClient.get(url);
    },
    updateUserDetailById: (data) => {
        const url = `${PREFIX}/update-user-detail`;
        return axiosClient.patch(url, data);
    },
    updateUserAvatar: (data) => {
        const url = `${PREFIX}/update-user-profile`;
        return axiosClient.patch(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default authApi;
