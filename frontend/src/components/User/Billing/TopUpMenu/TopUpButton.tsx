interface TopUpButtonProps {
    onClick: () => void;
}
const TopUpButton: React.FC<TopUpButtonProps> = ({ onClick }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="bg-blue-400 w-[70%] h-[72%] mt-4 text-white shadow-md rounded-lg hover:border-white border-2 hover:text-blue-600 transition duration-300"
        >
            Top Up
        </button>
    );
};
export default TopUpButton;