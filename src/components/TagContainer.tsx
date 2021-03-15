import React from "react";
import { Tag, ReportTag } from './Tag';
import "./styles/TagContainer.css"

export interface Props {
    listName: "activeTagList" | "inactiveTagList" | "unassignedTagList"
    tagList: ReportTag[],
    handleDrop: (tag: ReportTag, listName: string) => void,
    containerName?: string
}

export interface State {
}

export const TagContainer: React.FC<Props> = (props: Props) => {

    const renderTag = (tag: ReportTag) => {
        return (
            <Tag key={tag.id} tag={tag} handleDrop={handleDrop}/>
        )
    }

    const handleDragOver = (event: any) => {
        event.preventDefault()
    }

    const handleDragEnter = (event: any) => {
        event.preventDefault()
    }

    const handleDrop = (event: any) => {
        if (event.dataTransfer.types.includes("text/plain")) {
            let tag = JSON.parse(event.dataTransfer.getData("text/plain"));
            if (tag?.id) {
                props.handleDrop(tag, props.listName)
                event.preventDefault()
            }
        }
        
    }

    return (
        <div className="tag-container" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop}>
            <p style={{paddingTop: "10px"}}>{!!props.containerName ? props.containerName : "Tags"}</p>
            {!!props.tagList && props.tagList.map((tag: ReportTag) => {return renderTag(tag)})}
        </div>
    )
}