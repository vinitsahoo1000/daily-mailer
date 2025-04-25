import { useState } from "react";

interface DropdownButtonProps {
    selected: "horoscope" | "quotes";
    setSelected: (value: "horoscope" | "quotes") => void;
}

export const DropdownButton = ({ selected, setSelected }: DropdownButtonProps) => {
        const [open, setOpen] = useState(false);
    
        const handleSelect = (option: "horoscope" | "quotes") => {
        setSelected(option);
        setOpen(false);
        };
    
        return (
        <div className="relative inline-block text-left mt-4">
            <button
            onClick={() => setOpen(!open)}
            className="inline-flex justify-between items-center w-48 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
            >
            {selected === "horoscope" ? "🌟 Horoscope" : "🧠 Quotes"}
            <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </button>
    
            {open && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1 text-sm text-gray-700">
                <li>
                    <button
                    onClick={() => handleSelect("horoscope")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                    🌟 Horoscope
                    </button>
                </li>
                <li>
                    <button
                    onClick={() => handleSelect("quotes")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                    🧠 Quotes
                    </button>
                </li>
                </ul>
            </div>
            )}
        </div>
    );
};

