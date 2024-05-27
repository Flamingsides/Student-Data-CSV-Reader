# An Online Student Data CSV Reader

## About
This webpage is a simple dashboard that allows users to upload one / multiple student CSV files and view the list of uploaded students. Try it out [here](#how-to-run)!

## Features
- Upload single or multiple CSV files
- Upload using a button or by dragging files and dropping them close to the button
- Refuses to display data tables which lack any of the [necessary fields](#necessary-fields)
- Implements database to store data efficiently
- Automatic cleaning up of database and local file storage
- Dynamic building of database with custom fields recorded from CSV uploads

View project images [here](#project-images)!

### Necessary Fields
Each CSV file must have a Student Name, Program Name, and Serial Number field as required by the specification.
Punctuation and spacing does NOT matter.

## Teck Stack
FrontEnd: React
BackEnd: Node.js + Express.js
Database: SQLite3

## How To Run
1. Download both the `backend` and `frontend` folders
2. `cd` into the backend directory.
3. Type the command `npm install` followed by `npm run start`
4. Open a new terminal window and this time navigate to the `frontend` folder
5. Type the command `npm install` followed by `npm run preview`
6. Click on the link that appears (something like: `localhost:5173`)

## How To Use
1. To upload files, simply click on the `choose files` button or the green panel.
2. Alternatively, drag and drop one or more CSV files from your system into the browser.
    TIP: Use example files in the examples folder in the same directory as the `frontend` and `backend` folders
3. Click on `submit` to send files to `backend`
4. Click on `preview` to view all tables extrapolated from the CSV files
5. You may upload more files and redo the process :)

## Project Images
// TODO
