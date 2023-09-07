const express =  require("express");
const { google } = require("googleapis");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});


app.post("/", async (req, res) => {
    const { request, name } = req.body;
  
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const spreadsheetId= "1XSlIgGVfIL1osgF1AznvD3uTPqUC7LeR9VxO2IcrSzc";

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API 
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Get metadata about spreadsheet
    const metaData =  await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
        //range: "Sheet1!A:A", //columns range only one row
    })

    // Write rows to spreadsheet 
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[request, name]],
            // [["make a tutorial", "test"],
            //["make a tutorial 4", "test"]],  //Two arrays
        },

    });


    //res.send(getRows.data);
    res.send("Thankyou!");

});

app.listen(1337, (req, res) => console.log("running on 1337"));