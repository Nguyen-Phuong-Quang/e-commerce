// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Reviews = () => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     axios.get('/api/reviews')
//       .then(response => {
//         setReviews(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <div className="px-4 py-6 sm:px-0">
//         <h1 className="text-3xl font-bold mb-4">Reviews</h1>
//         {reviews.map(review => (
//           <div key={review.id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
//             <div className="px-4 py-5 sm:px-6">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">{review.comment}</h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">{review.rating} stars</p>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">{review.createdAt}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reviews;

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import productApi from '../../api/productApi';
import { ProgressSpinner } from 'primereact/progressspinner';

const EvaluationDialog = ({ visible, setVisible, evaluations }) => {
  const [evaluation, setEvaluation] = useState([]);
  const  [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchApi = async () => {
  //     setLoading(true);
  //     try{
  //       const response = await productApi.getEvaluation();
  //       if(response.data.type == "Success"){
  //         toastSuccess("success");
  //         setEvaluation(response.data.evaluation);
  //       }
  //       if(response.data.evaluation.lenght < 1){
  //         console.log("No evaluation found");
  //       }
  //     }
  //     catch(err){
  //       setEvaluation([]);
  //     }
  //     setLoading(false);
  //   };

  //   fetchApi();
  // }
  // , []);




  return (
    <>
          {loading && (
        <div className="w-full h-[600px] flex justify-center items-center">
          <ProgressSpinner className=" w-full" />
        </div>
      )}
    {!loading && (
    <Dialog visible={visible} onHide={() => {setVisible(false)}} header="Product Evaluations" className="w-full max-w-3xl">
      {evaluations.map((evaluation) => (
        <div className="flex flex-col border-b-2 border-gray-200 p-4" key={evaluation.id}>
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img src={evaluation.avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{evaluation.author}</h3>
              <span className="text-gray-500">{evaluation.date}</span>
            </div>
          </div>
          <p className="mb-4">{evaluation.comment}</p>
          <div className="flex justify-end">
            <Button label="Reply" className="mr-2" />
            <Button label="Report" className="p-button-danger" />
          </div>
        </div>
      ))}
    </Dialog>
    )
      };
      </>
  );
};

export default EvaluationDialog;