import { ReactNode, useEffect } from "react"

interface HideOnClickOutsideProps {
    modalRef: React.RefObject<HTMLElement>
    isOpen : boolean
    onClose : () => void
    children: ReactNode
}

const HideOnClickOutside = ({modalRef, isOpen, onClose, children} : HideOnClickOutsideProps) => {

    const handleButtonClick = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose()
            return
        }
    }

    useEffect(()=>{
        if (isOpen)
            document.addEventListener('mousedown', handleButtonClick)
            return () => {
                document.removeEventListener('mousedown', handleButtonClick)
            }
    }, [isOpen])
    
    return <>{isOpen && children}</>
}


export default HideOnClickOutside