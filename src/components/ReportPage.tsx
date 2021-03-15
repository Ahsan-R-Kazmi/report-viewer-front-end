import axios, { AxiosResponse } from "axios";
import * as constants from "../constants";
import React, { useState, useEffect, useCallback} from "react";
import { useToasts } from 'react-toast-notifications'
import "./styles/ReportPage.css"
import { SUCCESS_TOAST_OPTIONS, ERROR_TOAST_OPTIONS } from "../App";
import { ReportTag } from "./Tag";
import { TagContainer } from "./TagContainer";

export interface Props {
    reportId: string
}

export interface State {
    report: Report,
    tagLists: TagLists  
}

export interface TagLists {
    activeTagList: ReportTag[],
    inactiveTagList: ReportTag[],
    unassignedTagList: ReportTag[],
}

export interface Report {
    id: number
    filename: string
    name: string
	author: string
	synopsis: string
    text?: string
    score?: number
}

export const ReportPage: React.FC<Props> = (props: Props) => {

    const { addToast } = useToasts()

    const [report, setReport] = useState<Report>()
    const [tagLists, setTagLists] = useState({
        activeTagList: [] as ReportTag[],
        inactiveTagList: [] as ReportTag[],
        unassignedTagList: [] as ReportTag[]
    })

    const getReport = useCallback(
        () => {
            // Call the API to get the report information to display.
            axios.get(constants.SERVER_URL + constants.GET_REPORT_PATH + "/" + props.reportId)
                .then((res: AxiosResponse) => {
                    setReport(res.data)
                })
                .catch((err: any) => {
                    let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                        ? err?.response?.data
                        : "There was an error in getting the report from the server."
    
                    console.error(errorMessage)
                    addToast(errorMessage, ERROR_TOAST_OPTIONS)
                })
        }, [addToast, props.reportId]
    )

    const getReportTagLists = useCallback(
        () => {
            // Call the API to get the report tags and unassigned report tags.
            axios.get(constants.SERVER_URL + constants.GET_REPORT_TAG_LISTS_PATH + "/" + props.reportId)
                .then((res: AxiosResponse) => {
                    let tagLists: TagLists = {
                        activeTagList: !!res?.data["activeTagList"] ? res?.data["activeTagList"] : [] as ReportTag[],
                        inactiveTagList: !!res?.data["inactiveTagList"] ? res?.data["inactiveTagList"]: [] as ReportTag[],
                        unassignedTagList: !!res?.data["unassignedTagList"] ? res?.data["unassignedTagList"] : [] as ReportTag[]
                    }
                    setTagLists(tagLists)
                })
                .catch((err: any) => {
                    let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                        ? err?.response?.data
                        : "There was an error in getting the report tags from the server."
    
                    console.error(errorMessage)
                    addToast(errorMessage, ERROR_TOAST_OPTIONS)
                })
        }, [addToast, props.reportId]
    ) 

    useEffect(() => {
        getReport()
        getReportTagLists()
    }, [getReport, getReportTagLists])


    const handleDrop = (draggedTag: ReportTag, listName: string, active?: boolean) => {
        // Remove this tag from all the other lists (if present).
        let newActiveTagList = tagLists.activeTagList.filter((tag: ReportTag) => {return tag.id !== draggedTag.id})
        let newInactiveTagList = tagLists.inactiveTagList.filter((tag: ReportTag) => {return tag.id !== draggedTag.id})
        let newUnassignedTagList = tagLists.unassignedTagList.filter((tag: ReportTag) => {return tag.id !== draggedTag.id})

        
        // Add this tag to the list for this tag container based on the type and active values.
        switch (listName) {
            case 'activeTagList': {
                draggedTag.active = true
                newActiveTagList.push(draggedTag)
                break;
            }
            case 'inactiveTagList': {
                draggedTag.active = false
                newInactiveTagList.push(draggedTag)
                break;
            }
            case 'unassignedTagList': {
                draggedTag.active = undefined
                newUnassignedTagList.push(draggedTag)
                break;
            }
        }

        let reportTagList: ReportTag[] = []
        reportTagList = reportTagList.concat(newActiveTagList).concat(newInactiveTagList)

        // Add all the report tags to a single list and make a PUT request to save them.
        axios.put(constants.SERVER_URL + constants.UPDATE_REPORT_TAGS_PATH + "/" + props.reportId, reportTagList)
        .then((res: AxiosResponse) => {
            addToast("Successfully updated the report's tags.", SUCCESS_TOAST_OPTIONS)
        })
        .catch((err: any) => {
            let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                ? err?.response?.data
                : "There was an error in updating the report tags on the server"

            console.error(errorMessage)
            addToast(errorMessage, ERROR_TOAST_OPTIONS)
        })

        setTagLists(
            {
                activeTagList: newActiveTagList,
                inactiveTagList: newInactiveTagList,
                unassignedTagList: newUnassignedTagList
            }
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-2 unassigned-tags">
                    <TagContainer listName="unassignedTagList" tagList={tagLists.unassignedTagList} handleDrop={handleDrop}
                    containerName="Unassigned Tags"/>
                </div>
                <div className="col-10 report-container">
                    <div className="container">
                        <div className="report">
                            <h5>
                                {report?.name}
                            </h5>
                            <h6>
                                {report?.author}
                            </h6>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-6 assigned-tags">
                                        <TagContainer listName="activeTagList" tagList={tagLists.activeTagList} handleDrop={handleDrop} 
                                        containerName="Active Tags"/>
                                    </div>
                                    <div className="col-6 assigned-tags">
                                        <TagContainer listName="inactiveTagList" tagList={tagLists.inactiveTagList} handleDrop={handleDrop}
                                        containerName="Inactive Tags"/>
                                    </div>
                                </div>
                            </div>
                            <p className="report-text">
                                {report?.text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}