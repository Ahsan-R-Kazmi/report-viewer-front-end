import React, { useState } from "react";
import "./styles/SearchBar.css"

export interface Props {
    handleSubmit: (searchTerm: string) => void
}

export interface State {
    searchTerm: string
}

export const SearchBar: React.FC<Props> = (props: Props) => {

    const [searchTerm, setSearchTerm] = useState("")

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value)
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        props.handleSubmit(searchTerm)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="input-group search-bar-container">
                    <span>
                        <img
                            className="search-icon"
                            alt=""
                            src={window.location.origin + '/icons/search-24px.svg'}
                        />
                    </span>
                    <input className="search-bar" type="text" title="Search" placeholder="Search" value={searchTerm} onChange={handleChange} />
                </div>
            </form>
        </div>
    )
}