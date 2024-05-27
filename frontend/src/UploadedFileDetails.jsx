export default function UploadedFileDetails({ files }) {
    return (
        <div>
            {files.length !== 0 && <h3>CSVs Uploaded</h3>}
            {files.length === 0 && <h5><i>Please upload one or more CSVs to get started.</i></h5>}
            <ul id="files-list">
                {files?.map(file => {
                    return (
                        <li key={file.name}>{file.name}</li>
                    )
                })}
            </ul>

        </div>
    )
}