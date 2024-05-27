import axios from "axios";
import { useEffect, useState } from "react";

import TopPanel from "./TopPanel";
import "./styles.css"
import StudentDetailsDisplay from "./StudentDetailsDisplay";

export default function App() {
    const [filesStored, setFilesStored] = useState([]);
    const [tables, setTables] = useState([]);
    const [toUpdate, setToUpdate] = useState(false);
    
    async function getData() {
        setToUpdate(false);
        console.log("start timer");
        setTables("");
        try {
            // console.log("FILESSTORED: " + filesStored.join(", "));
            const response = await axios.get("http://localhost:3000/data")
            setTables(response.data)
        } catch (error) {
            console.error("An error occured while retreiving data: " + error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Student Data CSV Reader</h1>

            <TopPanel setFilesStored={setFilesStored} getData={getData} toUpdate={toUpdate} setToUpdate={setToUpdate} />

            { toUpdate && <p>Click Preview to see the latest data!</p> }
            { toUpdate || <StudentDetailsDisplay filesStored={filesStored} tables={tables}/> }
        </>
    );
}