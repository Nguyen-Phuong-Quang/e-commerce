import axiosClient from "./axiosClient";

const PREFIX = "/category";

const categoryApi = {
    // Get all category (Can use sort and search by name)
    query: (sort = 1, name = "") => {
        let sortQuery = "";
        if (sort === 1) {
            sortQuery = "asc,name";
        }
        if (sort === -1) {
            sortQuery = "desc,name";
        }
        const url = `${PREFIX}`;
        return axiosClient.get(url, {
            params: {
                sort: sortQuery,
            },
        });
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
    updateDetail: (id, data) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.patch(url, data);
    },

    deleteCategory: (id) => {
        const url = `${PREFIX}/${id}`;
        return axiosClient.delete(url);
    },
    // // Update category image (just image)
    // updateImage: (image) => {
    //     const url = `${PREFIX}/${id}`;
    //     return axiosClient.patch(
    //         url,
    //         { image },
    //         {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         }
    //     );
    // },
};

export default categoryApi;
