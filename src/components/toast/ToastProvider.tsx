import { ReactNode, useState } from "react"
import ToastContext, { ToastData } from "./ToastContext"
import { ToastType } from "./Toast"


export const ToastProvider = ({children} : {children: ReactNode}) => {
    const [toasts, setToast] = useState<ToastData[]>(new Array<ToastData>())

    const createToast = (message: string, type: ToastType, onClose?: ()=>void) => {
        const newToast : ToastData = {
            id: Math.random(),
            message: message,
            type: type,
            onClose: onClose
        }

        setToast(values => {
            const map = new Map<number, ToastData>(values.map(t=>[t.id, t]))
            if (map.has(newToast.id)) {
                console.error("toast with id already exists")
                return values
            }
            else return Array.from<ToastData>(map.set(newToast.id, newToast).values())
        })
    }

    const removeToast = (toastId: number) => {
        setToast(values => {
            return values.filter(t => t.id !== toastId)
        })
    }

    return (
        <ToastContext.Provider value={{toasts: toasts, createToast: createToast, removeToast: removeToast}} >
            {children}
        </ToastContext.Provider>
    )
}