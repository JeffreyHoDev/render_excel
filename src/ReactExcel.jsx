import React, { useState, useEffect } from 'react';
import { ExcelRenderer } from 'react-excel-renderer'

const ExcelDateToJSDate = (serial) => {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);


    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


const ReactExcel = () => {
    const [dataset, setData] = useState([])

    useEffect(() => {
        if(dataset.length !== 0){
            // send dataset to database
        }
    })

    const fileHandler = (e) => {
        let fileObj =  e.target.files[0];
        let importData = []
        ExcelRenderer(fileObj, (err, resp) => {
            if(err){
                console.log(err)
            }else {
                importData = resp.rows.map((row, i) => { 
                    if(i !== 0 && row[1] !== undefined){
                        // For the date time, need to use column 5 at row[5]
                        let sendObject = {
                            "fleet": row[1],
                            "eventdatetime": ExcelDateToJSDate(row[5]),
                            "eventtype": row[3]
                        }
                        // console.log(i + "  : " + ExcelDateToJSDate(row[5]))
                        return sendObject
                        // Then pass the data object to state first
                    }
                })
                let cleanData = importData.filter((row,i) => {
                    return i !== 0
                })
                setData(cleanData)
            }
        })
        
    }

    return (
        <div>
            <input type="file" placeholder="Upload Excel File here" onChange={fileHandler} />
        </div>
        
    )

}

export default ReactExcel;