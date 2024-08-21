import { createContext } from "react";
import { ToastType } from "./Toast";

export interface ToastData {
    id: number;
    message: string;
    type: ToastType;
    onClose?: ()=>void;
}

interface ToastContextData {
    toasts: ToastData[];
    createToast: (message: string, type: ToastType, onClose?: ()=>void) => void;
    removeToast: (toastId: number) => void;
}

const ToastContext = createContext<ToastContextData>({
    toasts: new Array<ToastData>(), 
    createToast: (_message: string, _type: ToastType, _onClose?: ()=>void) => 
        {console.error("provider for toasts not set correctly")},
    removeToast: (_toastId: number) => {console.error("provider for toasts not set correctly")}
})
export default ToastContext