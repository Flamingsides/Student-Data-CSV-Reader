import { useState } from "react";

export default function FileInputForm({ setFiles }) {
    const [error, setError] = useState(null);

    const validExtensions = ["csv"];

    function isValidExtension(file) {
        const extension = file.name.split(".").pop();
        return validExtensions.includes(extension);
    }

    function fileChangeHandler(event) {
        if (!event.target.files.length) {
            return;
        }

        const filesAttached = Array.from(event.target.files);
        const csvsAttached = filesAttached.filter(isValidExtension);

        if (csvsAttached.length !== filesAttached.length) {
            if (csvsAttached.length > 0) {
                setError("NOTE: Only CSVs were accepted.");
            } else if (filesAttached.length > 0) {
                setError("Only CSV files are allowed. Please try again.");
            }
        } else {
            setError("");
        }

        setFiles(csvsAttached);
    }

    return (
        <form>
            <label htmlFor="file">Upload a CSV file with student data</label><br /><br />

            <div id="file-input">
                <input
                    className="hidden"
                    id="file"
                    accept=".csv"
                    type="file"
                    multiple
                    onChange={fileChangeHandler}
                />
            </div>
            <p className="feedback">{error || ""}</p>
        </form>
    )
}