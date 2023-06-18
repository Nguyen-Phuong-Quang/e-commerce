import axiosClient from "./axiosClient";

const PREFIX = "/review";

const reviewApi = {
    add: (productId, data) => {
        const url = `${PREFIX}/${productId}`;
        return axiosClient.post(url, data);
    },
    update: (productId, reviewId, data) => {
        const url = `${PREFIX}/${productId}/${reviewId}`;
        return axiosClient.patch(url, data);
    },
    delete: (productId, reviewId) => {
        const url = `${PREFIX}/${productId}/${reviewId}`;
        return axiosClient.delete(url);
    },
    getAllReviews: (productId) => {
        const url = `${PREFIX}/${productId}`;
        return axiosClient.get(url);
    },
    getByProductAndReviewId: (productId, reviewId) => {
        const url = `${PREFIX}/${productId}/${reviewId}`;
        return axiosClient.get(url);
    },
};

export default reviewApi;
