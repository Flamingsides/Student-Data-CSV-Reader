const express = require("express");
const cors = require("cors");
const dataRoutes = require("./routes/data");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/data", dataRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("App is now accessible at http://localhost:3000");
})