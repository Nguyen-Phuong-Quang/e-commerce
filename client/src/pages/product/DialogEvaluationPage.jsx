import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import reviewApi from "../../api/reviewApi";
import userApi from "../../api/userApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { toastContext } from "../../contexts/ToastProvider";

const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const EvaluationDialog = ({ visible, setVisible, productId, onHide }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const { toastSuccess, toastError } = toastContext();

  //get review of product
  useEffect(() => {
    const fetchReivew = async () => {
      setLoading(true);
      try {
        const response = await reviewApi.getAllReviews(productId);
        if (response.data.type === "SUCCESS") {
          setReviews(response.data.reviews);
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
      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        header="Product Reviews"
        className="w-full max-w-3xl h-1/2"
      >
        {loading && (
          <div className="w-full h-full flex justify-center items-center">
            <ProgressSpinner className=" w-full" />
          </div>
        )}
        {!loading && (
          <>
            {reviews.length > 0 &&
              reviews.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 ml-16  mx-8 my-8 w-full "
                >
                  {userData[index] && (
                    <Avatar
                      label={"Avatar"}
                      image={userData[index].profileImage}
                      shape="circle"
                      size="xlarge"
                    />
                  )}
                  <div className="flex flex-col  ">
                    {userData[index] && (
                      <span className="text-2xl font-bold text-gray-700 mb-2">
                        {" "}
                        {userData[index].name}
                      </span>
                    )}
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
            {reviews.length === 0 && (
              <p className="text-gray-700 p-4 mx-8">
                {"No one has written a review for this product yet. "}
              </p>
            )}
          </>
        )}
      </Dialog>
      ;
    </>
  );
};

export default EvaluationDialog;
