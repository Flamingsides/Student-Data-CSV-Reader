import axios from "axios";
import { useState } from "react";

import FileInputForm from "./FileInputForm";
import UploadedFileDetails from "./UploadedFileDetails";

export default function({ setFilesStored, getData, toUpdate, setToUpdate }) {

    const [files, setFiles] = useState([]);

    function dataSubmit() {
        setToUpdate(true);
        const data = new FormData();
        files.forEach(file => {
            data.append("files", file);
        });

        axios.post("http://localhost:3000/data", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(response => {
                console.log(response);
                console.log("setting to files stored" + response.data);
                setFilesStored(response.data);
            })
            .catch(error => console.error("Error posting: " + error));
    }
    
    return (
        <>
            <FileInputForm setFiles={setFiles} />
            <UploadedFileDetails files={files} />
            <button id="submit-data-button" onClick={dataSubmit}>Submit Files</button>
            <br /><br />
            { toUpdate && <button id="retrieve-data-button" onClick={getData}>Preview</button>}
        </>
    )
}