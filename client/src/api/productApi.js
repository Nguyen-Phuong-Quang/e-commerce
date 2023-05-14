import axios from 'axios';

const baseUrl = 'http://localhost:5001/api/v1';

const productApi = {
   getAllProduct :  async () => {
    return await axios.get(`${baseUrl}/products`);
  },
  
  getProductById : async (id) => {
     return await axios.get(`${baseUrl}/products/${id}`);
  },
  
  addProduct : async (product) => {
    const response = await axios.post(`${baseUrl}/products`, product, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
   updateProductById:  async (id, product) => {
    const response = await axios.put(`${baseUrl}/products/${id}`, product, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
  
 deleteProduct : async (id) => {
    const response = await axios.delete(`${baseUrl}/products/${id}`);
    return response;
  },

  getEvaluation: async() => {
    const response = await axios.get(`${baseUrl}/products/reivews`);
    return response;
  }


}

export default productApi;
