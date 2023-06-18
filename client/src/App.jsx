import { RouterProvider } from "react-router-dom";
import { StateProvider } from "./contexts/StateProvider";
import router from "./router";
import ToastProvider from "./contexts/ToastProvider";
import { SearchProvider } from "./contexts/SearchProvider";

function App() {
    return (
        <StateProvider>
            <ToastProvider>
                <SearchProvider>
                    <RouterProvider router={router} />
                </SearchProvider>
            </ToastProvider>
        </StateProvider>
    );
}

export default App;
