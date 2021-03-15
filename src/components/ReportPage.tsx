import axios, { AxiosResponse } from "axios";
import { Button } from "react-bootstrap";
import * as constants from "../constants";
import React, { useState, useEffect, useCallback } from "react";
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
    activeTagList: ReportTag[],
    inactiveTagList: ReportTag[],
    unassignedTagList: ReportTag[]   
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
    const [activeTagList, setActiveTagList] = useState<ReportTag[]>([])
    const [inactiveTagList, setInactiveTagList] = useState<ReportTag[]>([])
    const [unassignedTagList, setUnassignedTagList] = useState<ReportTag[]>([])

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

    const getReportTagListAndUnassignedTagList = useCallback(
        () => {
            // Call the API to get the report tags and unassigned report tags.
            axios.get(constants.SERVER_URL + constants.GET_REPORT_TAG_LISTS_PATH + "/" + props.reportId)
                .then((res: AxiosResponse) => {
                    if (!!res?.data["activeTagList"]) {
                        setActiveTagList(res.data["activeTagList"])
                    }
                    if (!!res?.data["inactiveTagList"]) {
                        setActiveTagList(res.data["inactiveTagList"])
                    }
                    if (!!res?.data["unassignedTagList"]) {
                        setUnassignedTagList(res.data["unassignedTagList"])
                    }
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
        getReportTagListAndUnassignedTagList()
    }, [getReport, getReportTagListAndUnassignedTagList])


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-2 unassigned-tags">
                    <p style={{marginTop: "10px"}}>Unassigned Tags</p>
                    <TagContainer type="unassigned" tagList={unassignedTagList}/>
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
                                        <p>
                                            Active Tags
                                        </p>
                                        <TagContainer type="assigned" tagList={activeTagList}/>
                                    </div>
                                    <div className="col-6 assigned-tags">
                                        <p>
                                            Inactive Tags
                                        </p>
                                        <TagContainer type="assigned" tagList={inactiveTagList}/>
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