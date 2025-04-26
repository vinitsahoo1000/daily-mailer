
interface HeadingProps {
    label: string
}


export const Heading = ({label}:HeadingProps)=>{
    return(
        <div className="text-4xl pt-4 font-extrabold text-center text-yellow-400 font-serif">
            {label}
        </div>
    )
}