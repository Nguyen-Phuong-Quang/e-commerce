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
import reviewApi from '../../api/reviewApi';
import userApi from '../../api/userApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Rating } from "primereact/rating";
import { Avatar } from 'primereact/avatar';


const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const EvaluationDialog = ({ visible, setVisible, productId, onHide }) => {
  const [reviews, setReviews] = useState([]);
  const  [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  //get review of product
  useEffect(() => {
    const fetchReivew = async () => {
      setLoading(true);
      try {
        const response = await reviewApi.getAllReviews(productId);
        if (response.data.type === "SUCCESS") {
          setReviews(response.data.reviews);
          toastSuccess(response.data.message);
        }
      } catch (err) {
        // toastError(err.response.data.message);
        console.log(err);
      }
      setLoading(false);
    };

    fetchReivew();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDataPromises = reviews.map(async (item) => {
        try {
          const response = await userApi.getUserById(item.user);
          return response.data.user;
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      const userData = await Promise.all(userDataPromises);
      setUserData(userData);
    };

    fetchUserData();
  }, [reviews]);

  




  return (
    <>
          {loading && (
        <div className="w-full h-[600px] flex justify-center items-center">
          <ProgressSpinner className=" w-full" />
        </div>
      )}
    {!loading && (
    <Dialog visible={visible} onHide={() => {setVisible(false) }}  header="Product Reviews" className="w-full max-w-3xl h-1/2"> 
        { reviews.length > 0 && reviews.map((item, index) => (
          <div className="flex items-start space-x-4 ml-16  mx-8 my-8 w-full ">
            {userData[index] && (
              <Avatar
              label={"Avatar"}
              image={userData[index].profileImage}
              shape="circle"
              size="xlarge"
              
            />
            )}
            <div className="flex flex-col  ">
              {userData[index] && 
                  <span className="text-2xl font-bold text-gray-700 mb-2"> {userData[index].name}</span>
              }
              <Rating
                value={item.rating}
                readOnly
                stars={5}
                cancel={false}
                className="text-primary-500"
              />
              <p>{formatDate(item.createdAt)}</p>
              <p className="text-gray-600 mt-1">{item.review}</p>
            </div>
          </div>
        ))}
        {reviews.length === 0 &&
          <p className="text-gray-700 p-4 mx-8">{"No one has written a review for this product yet. "}</p>

        }
        {/* </div> */}
      
    </Dialog>
    )
      };
      </>
  );
};

export default EvaluationDialog;