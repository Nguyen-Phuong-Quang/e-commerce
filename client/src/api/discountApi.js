import axios from 'axios';

const baseUrl = 'http://localhost:5001/api/v1/discount';

const discountApi = {
   getAllDiscount :  async () => {
    return await axios.get(`${baseUrl}/discounts`);
  },
  
  getDiscountById : async (id) => {
     return await axios.get(`${baseUrl}/discounts/${id}`);
  },
  
  addDiscount : async (discount) => {
    const response = await axios.post(`${baseUrl}/discounts`, discount, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

   UpdateDiscountById :  async (id, discount) => {
    const response = await axios.put(`${baseUrl}/discount/${id}`, discount, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

}
// import axiosClient from "./axiosClient";

// const PREFIX = "/discount";

// const discountApi = {
//     generate: (data) => {
//         const url = `${PREFIX}/generate`;
//         return axiosClient.post(url, data);
//     },
// };

// export default discountApi;
