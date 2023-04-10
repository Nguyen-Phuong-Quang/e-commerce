import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import route from "../../constants/route";

export default function Signup() {
    const [role, setRole] = useState(null);
    const roles = [
        "Seller", "Customer"
    ];
    const [image, setImage] = useState(undefined);
    const [preview, setPreview] = useState();

    const [error, setError] = useState({});

    // create a preview as a side effect, whenever selected file is changed
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
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="relative flex flex-col items-center shadow-2xl border-2 border-slate-300 rounded-xl w-2/3 h-4/5 bg-gradient-to-t from-cyan-50 to-sky-100">
                <div className="py-2.5 border-b-2 border-slate-300 w-full text-center">
                    <span className="text-3xl font-bold">Sign up</span>
                </div>
                <div className="flex gap-4 w-full px-4 pt-4">
                    <div className="relative flex flex-col items-center w-1/3">
                        {image && (
                            <img
                                src={preview}
                                alt="profile"
                                className="my-6 rounded-full h-60 w-60 object-cover"
                            />
                        )}
                        <label
                            htmlFor="profile-image-sign-up"
                            className="absolute font-bold flex justify-center items-center h-12 w-1/2 mt-6 bg-cyan-600 text-white hover:cursor-pointer rounded-md bottom-0"
                        >
                            <div>
                                <i className="pi pi-image mr-2" />{" "}
                                <span>Upload</span>
                            </div>
                        </label>
                        <input
                            id="profile-image-sign-up"
                            type="file"
                            hidden
                            onChange={onSelectFile}
                        />
                    </div>
                    <div className="flex flex-col gap-5 w-1/3">
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Name</label>
                            <InputText />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Address</label>
                            <InputText />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Phone</label>
                            <InputNumber />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Company Name</label>
                            <InputText />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 w-1/3">
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Email</label>
                            <InputText type="email" />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Password</label>
                            <InputText type="password" />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Confim Password</label>
                            <InputText type="password" />
                        </div>
                        <div className="flex flex-col">
                            <label className="m-2 text-lg font-medium">Role</label>
                            <Dropdown
                                options={roles}
                                value={role}
                                onChange={(e) => setRole(e.value)}
                                placeholder="Select role"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 flex flex-col justify-center items-center my-4 w-full">
                    <Button label="Sign up" className="w-1/4" />
                    <Link
                        to={route.SIGNIN}
                        className="text-sm text-blue-600 mt-2 hover:underline"
                    >
                        Or you already have account? Sign in here.
                    </Link>
                </div>
            </div>
        </div>
    );
}
