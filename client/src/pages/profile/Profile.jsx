import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import { Button } from "primereact/button";

export default function Profile() {
    const [user, setUser] = useState({});
    const [image, setImage] = useState(undefined);
    const [preview, setPreview] = useState();

    const fetch = async () => {
        try {
            const response = await userApi.getUserById(
                localStorage.getItem("userId")
            );
            if (response.data.type === "SUCCESS") {
                setUser(response.data.user);
                setPreview(response.data.user.profileImage);
            }
        } catch (err) {
            alert(err);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

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
    };

    return (
        <div className="flex pt-10">
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
                <label
                    htmlFor="profile-image-sign-up"
                    className="font-bold flex justify-center items-center h-12 w-1/2 mx-auto mt-6 mb-2 bg-cyan-600 text-white hover:cursor-pointer rounded-md"
                >
                    <div>
                        <i className="pi pi-image mr-2" />{" "}
                        <span>Update Avatar</span>
                    </div>
                </label>
            </div>
            <div className="w-2/3 text-xl">
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
                    <span className="font-bold">{user.companyNam}</span>
                </div>
            </div>
        </div>
    );
}
