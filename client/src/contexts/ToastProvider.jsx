import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
    const toast = useRef(null);

    const toastSuccess = (message) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: message,
            life: 3000,
        });
    };

    const toastInfo = (message) => {
        toast.current.show({
            severity: "info",
            summary: "Info",
            detail: message,
            life: 3000,
        });
    };

    const toastWarn = (message) => {
        toast.current.show({
            severity: "warn",
            summary: "Warning",
            detail: message,
            life: 3000,
        });
    };

    const toastError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            life: 3000,
        });
    };

    return (
        <ToastContext.Provider
            value={{ toastSuccess, toastError, toastWarn, toastInfo }}
        >
            <Toast ref={toast} position="bottom-right" />
            {children}
        </ToastContext.Provider>
    );
}
export const toastContext = () => useContext(ToastContext);
