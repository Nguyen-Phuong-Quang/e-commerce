import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import ProfileEdit from "./ProfileEdit";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastContext } from "../../contexts/ToastProvider";

export default function Profile() {
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [user, setUser] = useState({});
    const [image, setImage] = useState(undefined);
    const [preview, setPreview] = useState();
    const [imageUpdated, setImageUpdated] = useState(false);
    const [loading, setLoading] = useState(false);

    const { toastError } = toastContext();

    const fetch = async () => {
        setLoading(true);
        try {
            const response = await userApi.getUserByToken();
            if (response.data.type === "SUCCESS") {
                setUser(response.data.user);
                setPreview(response.data.user.profileImage);
            }
        } catch (err) {
            // toastError(err.response.data.message);
        }
        setLoading(false);
    };

    const { toastSuccess } = toastContext();

    const handleUpdateAvatar = () => {
        const submit = async () => {
            setLoading(true);
            try {
                const response = await userApi.updateUserAvatar({ image });
                if (response.data.type === "SUCCESS") {
                    setUser(response.data.user);
                    setImageUpdated(false);
                    toastSuccess(response.data.message);
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        submit();
    };

    useEffect(() => {
        fetch();
    }, [visibleEdit]);

    useEffect(() => {
        if (!image) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(undefined);
            return;
        }
        // I've kept this example simple by using the first image instead of multiple
        setImage(e.target.files[0]);

        setImageUpdated(true);
    };

    return (
        <div className="flex pt-10">
            {!loading && (
                <>
                    <div className="w-1/3 text-center">
                        <img
                            src={preview}
                            alt="profile"
                            className="rounded-full h-52 w-52 object-cover mx-auto shadow-2xl"
                        />

                        <input
                            id="profile-image-sign-up"
                            type="file"
                            hidden
                            onChange={onSelectFile}
                        />
                        {imageUpdated ? (
                            <Button
                                className="font-bold flex justify-center items-center h-12 w-1/3 mx-auto mt-6 mb-2 bg-cyan-600 text-white hover:cursor-pointer rounded-md"
                                label="Submit"
                                icon="pi pi-check"
                                onClick={() => handleUpdateAvatar()}
                            />
                        ) : (
                            <label
                                htmlFor="profile-image-sign-up"
                                className="font-bold flex justify-center items-center h-12 w-1/2 mx-auto mt-6 mb-2 bg-cyan-600 text-white hover:cursor-pointer rounded-md"
                            >
                                <div className="flex items-center my-2">
                                    <i className="pi pi-image mr-2" />{" "}
                                    <span>Update Avatar</span>
                                </div>
                            </label>
                        )}
                    </div>
                    <div className="w-2/3 text-xl">
                        <div className="mb-2 flex justify-between w-3/4 items-center">
                            <span className="font-semibold text-3xl">
                                PROFILE
                            </span>
                            <Button
                                onClick={() => setVisibleEdit(true)}
                                className="h-1/2"
                                size="small"
                                icon="pi pi-pencil"
                                label="Edit"
                            />
                        </div>
                        <div className="mb-2">
                            <span>Name: </span>
                            <span className="font-bold">{user.name}</span>
                        </div>
                        <div className="mb-2">
                            <span>Email: </span>
                            <span className="font-bold">{user.email}</span>
                        </div>
                        <div className="mb-2">
                            <span>Phone: </span>
                            <span className="font-bold">{user.phone}</span>
                        </div>
                        <div className="mb-2">
                            <span>Role: </span>
                            <span className="font-bold">{user.role}</span>
                        </div>
                        <div className="mb-2">
                            <span>Address: </span>
                            <span className="font-bold">{user.address}</span>
                        </div>
                        <div className="mb-2">
                            <span>Company: </span>
                            <span className="font-bold">
                                {user.companyName}
                            </span>
                        </div>
                    </div>
                </>
            )}

            {loading && <ProgressSpinner />}

            {visibleEdit && (
                <ProfileEdit
                    visible={visibleEdit}
                    setVisible={setVisibleEdit}
                    user={user}
                />
            )}
        </div>
    );
}
