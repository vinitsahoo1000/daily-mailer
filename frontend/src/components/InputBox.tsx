interface InputBoxProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label: string;
    value?: string;
    name?: string;
}

export const InputBox = ({onChange, placeholder,label, value, name}: InputBoxProps) => {
    return(
        <div className="mt-3 p-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input type="text" name={name} onChange={onChange} className="border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-72 p-2.5" value={value} placeholder={placeholder} />
        </div>
    )
}