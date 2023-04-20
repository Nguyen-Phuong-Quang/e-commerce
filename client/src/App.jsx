import { RouterProvider } from "react-router-dom";
import { StateProvider } from "./contexts/StateProvider";
import router from "./router";
import ToastProvider from "./contexts/ToastProvider";

function App() {
    return (
        <StateProvider>
            <ToastProvider>
                <RouterProvider router={router} />
            </ToastProvider>
        </StateProvider>
    );
}

export default App;
