import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import HideOnClickOutside from '../src/components/common/HideOnClickOutside'
import React from 'react';


describe('hide on click outside component', ()=>{
    test('component render childs when is active', ()=> {
        const textContent = 'This should show'

        const modalRef = React.createRef<HTMLParagraphElement>();

        render(
            <HideOnClickOutside modalRef={modalRef} isOpen={true} onClose={()=>{}}>
                <p ref={modalRef}>{textContent}</p>
            </HideOnClickOutside >
        )

        expect(screen.getByText(textContent)).toBeInTheDocument()
    })

    test('component does not render childs when in inactive', () => {
        const textContent = 'This should not show'

        const modalRef = React.createRef<HTMLParagraphElement>();

        render(
            <HideOnClickOutside modalRef={modalRef} isOpen={false} onClose={()=>{}}>
                <p ref={modalRef}>{textContent}</p>
            </HideOnClickOutside >
        )

        expect(screen.queryByText(textContent)).toBeNull()
    })

    test('component calls onClose when clicking outside of the ref element', () => {
        const onClose = jest.fn();
        const modalRef = React.createRef<HTMLDivElement>();

        render(
            <>
                <div data-testid="outside">Outside Element</div>
                <HideOnClickOutside modalRef={modalRef} isOpen={true} onClose={onClose}>
                    <div ref={modalRef}>Inside Element</div>
                </HideOnClickOutside>
            </>
        );

        fireEvent.mouseDown(screen.getByTestId('outside'));

        expect(onClose).toHaveBeenCalled();
    });

    test('component does not call onClose when clicking inside the ref element', () => {
        const textContent = 'This should not show'
        const onClose = jest.fn();
        const modalRef = React.createRef<HTMLDivElement>();

        render(
            <>
                <div data-testid="outside">Outside Element</div>
                <HideOnClickOutside modalRef={modalRef} isOpen={true} onClose={onClose}>
                    <div ref={modalRef}>{textContent}</div>
                </HideOnClickOutside>
            </>
        );

        fireEvent.mouseDown(screen.getByText(textContent));

        expect(onClose).not.toHaveBeenCalled();
    });
})

