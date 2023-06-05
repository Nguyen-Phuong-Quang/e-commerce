import axiosClient from './axiosClient';


const PREFIX = "/product";

const discountApi = {
  getAllDiscount: () => {
    const url = `${PREFIX}`;
    return axiosClient.get(url);
},
  
  getDiscountById :  (id) => {
     const url =  (`${PREFIX}/${id}`);
     return axiosClient.get(url);
  },

  addDiscount: (discount) => {
    const url = `${PREFIX}`;
    return axiosClient.post(url, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
},

  
  UpdateDiscountById: (id, discount) => {
    const url = `${PREFIX}`;
    return axiosClient.put(url, discount, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
},

}

// const PREFIX = "/discount";

// const discountApi = {
//     generate: (data) => {
//         const url = `${PREFIX}/generate`;
//         return axiosClient.post(url, data);
//     },
// };

export default discountApi;
