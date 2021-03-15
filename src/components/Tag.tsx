import React, { useState, useEffect } from "react";
import "./styles/Tag.css"

export interface Props {
    tag: ReportTag
}

export interface State {
    color: string
}

export interface ReportTag {
    id: number,
    name: string,
    color: string
    active?: boolean
}

export const Tag: React.FC<Props> = (props: Props) => {

    const [color, setColor] = useState("#000000")

    useEffect(() => {
        // If the props provide a valid color, then set the state with it to be used as the border color for the tag.
        if (/^#[0-9A-F]{6}$/i.test(props.tag.color)) {
            setColor(props.tag.color)
        }
    }, [props.tag.color])

    const handleDragStart = (event: any) => {
        const target = event.target
        event.dataTransfer.dropEffect = "move"
        event.target.customData = {
            tag: props.tag
        }

        setTimeout(() => {
            target.style.display = "none"
        }, 0)
    }

    const handleDragOver = (event: any) => {
        event.stopPropagation()
    }

    const handleDragEnd = (event: any) => {
        event.target.style.display = ""
    }

    return (
        <div
            draggable={true}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="tag" style={{ border: "2px solid " + color, fontSize: "10px" }}>
            {props.tag.name}
        </div>
    )
}