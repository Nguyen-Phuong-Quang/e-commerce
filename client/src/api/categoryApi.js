import axiosClient from "./axiosClient";

const PREFIX = "/category";

const categoryApi = {
    // Get all category (Can use sort and search by name)
    query: () => {
        const url = `${PREFIX}`;
        return axiosClient.get(url);
    },

    // Get category by id
    getById: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.get(url);
    },

    // Create category
    create: (data) => {
        const url = `${PREFIX}`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Update category detail (not image)
    updateDetail: (data) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.patch(url, data);
    },

    // Update category image (just image)
    updateImage: (image) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.patch(
            url,
            { image },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};

export default categoryApi;
