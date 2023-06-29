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
    query: (sort = 1, query = {}) => {
        const sortQuery = sort === 1 ? "asc,name" : "desc,name";
        const url = `${PREFIX}`;
        return axiosClient.get(url, {
            params: {
                sort: sortQuery,
                ...query,
            },
        });
    },
    create: (data) => {
        const url = `${PREFIX}`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    updateUserDetail: (data) => {
        const url = `${PREFIX}/update-user-detail`;
        return axiosClient.patch(url, data);
    },
    updateUserDetailById: (id, data) => {
        const url = `${PREFIX}/update-user-detail/${id}`;
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
    deleteUser: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.delete(url);
    },
};

export default authApi;
