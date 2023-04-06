import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import route from "../../constants/route";

export default function Signin() {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center shadow-2xl border-2 border-slate-300 rounded-xl w-1/4">
                <div className="py-2.5 border-b-2 border-slate-300 w-full text-center">
                    <span className="text-3xl font-bold">Sign in</span>
                </div>
                <div className="w-full">
                    <div className="flex flex-col mt-4 mx-4">
                        <label htmlFor="username">Email</label>
                        <InputText
                            aria-describedby="username-help"
                            type="email"
                            className=""
                        />
                    </div>
                    <div className="flex flex-col mt-4 mx-4">
                        <label htmlFor="username">Password</label>
                        <InputText
                            aria-describedby="username-help"
                            type="password"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center my-4 w-full">
                    <Button label="Sign in" className="w-1/2" />
                    <Link to={route.SIGNUP} className="text-sm text-blue-600 mt-2 hover:underline">
                        Or you don't have account? Sign up here.
                    </Link>
                </div>
            </div>
        </div>
    );
}
