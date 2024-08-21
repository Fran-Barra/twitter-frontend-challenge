import { useContext } from "react"
import ToastContext, { ToastData } from "./ToastContext"
import Toast, { ToastType } from "./Toast"
import { StyledToastListDisplay } from "./StyledToastListDisplay"
import { TOASTS_DURATION } from "../../util/Constants"


export const ToastListDisplay = () => {
    const {toasts, removeToast, createToast} = useContext(ToastContext)

    const dataToToast = (toastData: ToastData) => {
        const closeToast = () => {
            if (toastData.onClose) toastData.onClose()
            removeToast(toastData.id)            
        }

        //TODO: this is not be working correctly, this is run each time it renders
        //const cancelToken = setTimeout(closeToast, TOASTS_DURATION)
        

        return <Toast 
            key={toastData.id}
            show
            message={toastData.message}
            type={toastData.type}
            onClose={()=>{
                closeToast()
                //clearTimeout(cancelToken)
            }}
        />
    }
    
    return (
        <StyledToastListDisplay>
            {toasts.map(dataToToast)}
        </StyledToastListDisplay>
    )
}