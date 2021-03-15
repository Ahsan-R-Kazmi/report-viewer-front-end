import axios, { AxiosResponse } from "axios";
import React, { useState, useEffect, useCallback } from "react";
import * as constants from "../constants";
import { useToasts } from 'react-toast-notifications'
import "./styles/ReportList.css"
import {  ERROR_TOAST_OPTIONS } from "../App";
import { SearchBar } from "./SearchBar";
import {Report} from "./ReportPage"

export interface Props {
}

export interface State {
    reportList: Report[]
}

export const ReportList: React.FC<Props> = (props: Props) => {

    const { addToast } = useToasts()

    const [searchTerm, setSearchTerm] = useState("")
    const [reportList, setReportList] = useState<Report[]>([])

    // The second parameter in useCallback indicates that a new memoized callback will be returned if the dependencies (addToast, searchTerm) change.
    // For example, when the searchTerm state changes then the callback will be updated, which will in turn cause useEffect to be fired, since 
    // getReportList is provided in its dependencyList.
    const getReportList = useCallback(
        () => {
            // Call the API to get all the reports to display.
            axios.get(constants.SERVER_URL + constants.GET_REPORT_LIST_PATH + "?searchTerm=" + searchTerm)
                .then((res: AxiosResponse) => {
                    setReportList(res.data)
                })
                .catch((err: any) => {
                    let errorMessage = (!!err?.response?.data && typeof err?.response?.data === 'string')
                        ? err?.response?.data
                        : "There was an error in getting the reports from the server."
    
                    console.error(errorMessage)
                    addToast(errorMessage, ERROR_TOAST_OPTIONS)
                })
        }, [addToast, searchTerm]
    ) 

    // The array in the second parameter indicates that useEffect will only fire if the values in the array change.
    // Therefore, if getReportList changes, then useEffect will fire. (The function getReportList change when it's dependencies change.)
    useEffect(() => {
        getReportList()
    }, [getReportList])

    const renderReportList = () => {

        if (!!reportList) {
            return !!reportList && reportList.map(
                (report: Report, index: number, array: Report[]) => {
                    return renderReport(report)
                }
            )
        } else {
            return (
                <h4 style={{textAlign: "center"}}>
                    No Results Found
                </h4>
            )
        }

        
    }

    const handleReportClick = (reportId: number, event: any) => {
        event.preventDefault()
        event.stopPropagation()
        
        window.open('report/' + reportId)
    }

    const renderReport = (report: Report) => {
        console.log(report.synopsis)
        return (
            <div onClick={(event: any) => {handleReportClick(report.id, event)}} className="card">
                <h5>
                    {report.name}
                </h5>
                <h6>
                    {report.author}
                </h6>
                <p style={{fontSize: "14px", marginBottom: "6px"}}>
                    {report.synopsis}
                </p>
            </div>
        )
    }

    const handleSearchBarSubmit = (searchTerm: string) => {
        setSearchTerm(searchTerm)
    }

    return (
        <div>
            
            <div className="container">
                <div className="search">
                    <SearchBar handleSubmit={handleSearchBarSubmit} />
                </div>
                {renderReportList()}
            </div>
        </div>
    )
}