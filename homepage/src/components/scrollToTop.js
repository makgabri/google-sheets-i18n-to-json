import { useState } from "react";
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    window.addEventListener('scroll', () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    })

    return (
        <div className="scroll-top-button">
            <BsFillArrowUpCircleFill />
        </div>
    );
}

export default ScrollToTop;
