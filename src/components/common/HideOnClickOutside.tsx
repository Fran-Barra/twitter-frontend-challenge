import { ReactNode, useEffect, useRef } from "react"
import { StyledComponent } from "styled-components"

interface HideOnClickOutsideProps {
    Wrapper: StyledComponent<"div", any>,
    wrapperProps?: any
    isOpen : boolean
    onClose : () => void
    children: ReactNode
}

const HideOnClickOutside = ({Wrapper, wrapperProps, isOpen, onClose, children} : HideOnClickOutsideProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleButtonClick = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    
    if (!isOpen) return <></>
    return (
        <Wrapper ref={containerRef} {...wrapperProps}>
            {children}
        </Wrapper>
    )
}

export default HideOnClickOutside