import { useContext } from "react"
import ToastContext, { ToastData } from "./ToastContext"
import Toast from "./Toast"
import { StyledToastListDisplay } from "./StyledToastListDisplay"


export const ToastListDisplay = () => {
    const {toasts, removeToast} = useContext(ToastContext)

    const dataToToast = (toastData: ToastData) => {
        const closeToast = () => {
            if (toastData.onClose) toastData.onClose()
            removeToast(toastData.id)            
        }

        

        return <Toast 
            key={toastData.id}
            show
            message={toastData.message}
            type={toastData.type}
            onClose={()=>{
                closeToast()
            }}
        />
    }
    
    return (
        <StyledToastListDisplay>
            {toasts.map(dataToToast)}
        </StyledToastListDisplay>
    )
}