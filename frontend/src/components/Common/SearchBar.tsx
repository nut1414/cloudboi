import React, { useState, useCallback } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import InputField from "./InputField"

interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    className?: string
    initialValue?: string
    width?: string
}

const SearchBar: React.FC<SearchBarProps> = React.memo(({
    placeholder = "Search...",
    onSearch = () => { },
    className = "",
    initialValue = "",
    width = "w-64",
}) => {
    const [query, setQuery] = useState(initialValue)

    const handleInputChange = useCallback((newQuery: string) => {
        setQuery(newQuery)
        onSearch(newQuery)
    }, [onSearch])

    return (
        <div className={`${className} ${width}`}>
            <InputField
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                endIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
            />
        </div>
    )
})

export default SearchBar 