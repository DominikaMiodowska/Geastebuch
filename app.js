"use strict"

let fs = require("fs");
let express = require("express");
let bodyParser = require("body-parser");
let GuestbookEntry = require("./src/GuestbookEntry")


fs.readFile("./data.json", "utf-8", (err, data) => {    // see file
    if (err) throw err;
    let d = JSON.parse(data);

    let entries = [];
    for(let entry of d){
        entries.push(new GuestbookEntry(entry.title, entry.content));
    }

    // Starte den Server
    let app = express();
    app.set("view engine", "ejs");
    app.set("views", "./views");

    app.use(bodyParser.urlencoded({extended: true}));       // send dane
    app.use(express.static("./public"));


    app.get("/", (req, res) =>{
        res.render("index",{
            entries:  entries
        });
    });

    app.post("/guestbook/new", (req, res) => {
        let content = req.body.content;
        let title = req.body.title;

        let newEntry = new GuestbookEntry(title, content);
        entries.push(newEntry);             // *** entris ist ein Array   ***

        //zapisz dane w data.json
        fs.writeFile("./data.json", JSON.stringify(entries), function(err, result) {
            if(err) console.log('error', err);
          });       // przeksztalc entries Array na string


        res.redirect("/"); 

    });


    app.listen(5000, () => {
        console.log("App wurde gestartet auf localhost:5000");
    })

    })
