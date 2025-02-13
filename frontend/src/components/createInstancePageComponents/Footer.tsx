import React from "react";

interface FooterProps {

}

const Footer: React.FC<FooterProps> = ({ }) => {
    return (
        <>
            {/* Sticky Footer */}
            <footer className="fixed bottom-0 ml-4 left-60 w-[1000px] bg-[#D5C6E0] bg-opacity-50 text-black py-4  flex justify-end pr-4 ">
                <button className="bg-[#967AA1]  text-white px-6 py-2 rounded-lg hover:text-black">Create____</button>
            </footer>
        </>
    );
};
export default Footer;