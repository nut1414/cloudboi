interface TopUpInputProps {
    creditValue: number | "";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const TopUpInput: React.FC<TopUpInputProps> = ({ creditValue, onChange }) => {
    return (
        <input
            type="text"
            placeholder="Enter amount..."
            value={creditValue !== "" ? `${creditValue} CBC` : ""}
            onChange={onChange}
            className="w-[140%] mt-4 ml-10 p-2 shadow-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};
export default TopUpInput;