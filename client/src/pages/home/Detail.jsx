import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "./../../api/productApi";
import userApi from "./../../api/userApi";
import reviewApi from "./../../api/reviewApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import {Avatar} from "primereact/avatar";

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toastError, toastSuccess } = toastContext();
  const [data, setData] = useState({});
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProductById(id);
        if (response.data.type === "SUCCESS") {
          setData(response.data.product);
          // toastSuccess(response.data.message);
        }
      } catch (err) {
        // toastError(err.response.data.message);
        console.log(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchReivew = async () => {
      setLoading(true);
      try {
        const response = await reviewApi.getAllReviews(id);
        if (response.data.type === "SUCCESS") {
          setReview(response.data.reviews);
          // toastSuccess(response.data.message);
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
      const userDataPromises = review.map(async (item) => {
        try {
          const response = await userApi.getUserById(item.user);
          return response.data.user;
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      const uData = await Promise.all(userDataPromises);
      setUserData(uData);
    };

    fetchUserData();
  }, [review]);

  return (
    <>
      {loading && (
        <div className="w-full h-[600px] flex justify-center items-center">
          <ProgressSpinner className=" w-full" />
        </div>
      )}
      {!loading && (
        <div className="flex flex-col ">
          {/* first--------------- */}
          <div className="grid grid-cols-2 gap-4 py-4 px-6">
            <div className="flex flex-col">
              <img
                src={data.mainImage}
                alt={data.name}
                className="h-[400px] object-contain rounded-lg shadow-md object-cover"
              />
              <div className="mt-4 flex flex-row flex-wrap ">
                {data.images &&
                  data.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={data.name}
                      className={`h-20 w-20 m-1 object-cover box-border border-2 border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${
                        image === data.mainImage && "border-primary-500"
                      }`}
                      onClick={() => {
                        setData((pre) => ({
                          ...pre,
                          mainImage: image,
                        }));
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* <div className="space-y-4  ml-4  p-4 rounded-lg"> */}
            <div className="flex flex-col justify-between mb-4 ml-4 shadow-lg p-4 rounded-lg">
              {/* name  */}
              <h3 className="text-3xl font-bold text-red-600">{data.name}</h3>
              {/* price  */}
              <div className="flex items-center ">
                <span className="text-3xl font-bold">
                  {" "}
                  <span className="text-xs text-red-500">₫</span>
                  {data.priceAfterDiscount}
                </span>
                <span className="text-gray-400 text-sm line-through ml-2">
                  <span className="text-xs text-red-500">₫</span>
                  {data.price}
                </span>
              </div>
              {/* colorsss  */}
              <div>
              <span className="font-semibold">Colors</span>
              <div className="flex space-x-4 mt-4">
                {data.colors &&
                  data.colors.map((color, index) => (
                    <span
                      key={index}
                      style={{backgroundColor: color.color.toLowerCase(), opacity:0.5}}
                      className={`h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md 
                         }`}
                    />
                  ))}
              </div>
              </div>
              {/* size   */}
              <div>
              <span className="font-semibold">Sizes</span>
              <div className="flex space-x-4 mt-4">
                {data.sizes &&
                  data.sizes.map((size, index) => (
                    <span
                      key={index}
                      className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                         }`}
                    >
                      {size.size.toUpperCase()}
                    </span>
                  ))}
              </div>
              </div>
              {/* quantity   */}
              <div className="flex items-center space-x-2 pt-2 mb-8">
                <span className="font-semibold">Quantity</span>
                <span>{data.quantity}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 block font-bold text-black opacity-70 ml-8 mr-8 text-2xl  capitalize bg-gray-200 py-4 ml-4 rounded-lg">
               <p className="px-4">DESCRIPTION</p>
          </div>
          <div className="mx-8 mb-8">{ data.description && 
          <p className="text-gray-700 p-4">{data.description}</p>
          }
          { !data.description && 
          <p className="text-gray-700 p-4">{"The seller does not ask anything about this product"}</p>
          }
          </div>

          <div className="mt-8 block font-bold text-black opacity-70 ml-8 mr-8 text-2xl  capitalize bg-gray-200 py-4 ml-4 rounded-lg">
               <p className="px-4">REVIEWS</p>
          </div>


          {/* second----------------- */}
          <div className="w-full">
          { review.length > 0 && review.map((item, index) => (
            <div className="flex items-start space-x-4 ml-16  mx-8 my-8 w-full ">
              {/* <img
                        src={userData[index].profileImage}
                        alt="Avatar"
                        className="h-12 w-12 rounded-full object-cover"
                      /> */}
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
          {review.length === 0 &&
            <p className="text-gray-700 p-4 mx-8">{"No one has written a review for this product yet. "}</p>

          }
          </div>
        </div>
      )}
    </>
  );
}
