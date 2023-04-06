import { RouterProvider } from "react-router-dom";
import { StateProvider } from "./contexts/StateProvider";
import router from "./router";

function App() {
    return (
        <StateProvider>
            <RouterProvider router={router} />
        </StateProvider>
    );
}

export default App;
