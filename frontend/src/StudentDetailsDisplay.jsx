export default function StudentDetailsDisplay({ filesStored, tables }) {
    return (
        <>
            {filesStored.length === 0 || <div dangerouslySetInnerHTML={{ __html: tables }}></div> }
        </>
    )
}