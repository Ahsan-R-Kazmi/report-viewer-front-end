import React, { useState, useEffect } from "react";
import { Tag, ReportTag } from './Tag';
import "./styles/TagContainer.css"

export interface Props {
    type: "assigned" | "unassigned"
    tagList: ReportTag[]
}


export interface State {
}


export const TagContainer: React.FC<Props> = (props: Props) => {

    const renderTag = (tag: ReportTag) => {
        return (
            <div>
                <Tag tag={tag}/>
            </div>
        )
    }

    return (
        <div>
            {!!props.tagList && props.tagList.map((tag: ReportTag) => {return renderTag(tag)})}
        </div>
    )
}