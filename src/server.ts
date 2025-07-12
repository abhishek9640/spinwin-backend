import express, { Request, Response } from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import  {connect}  from './configs/database.js';
import {routeIndex} from "./routes/index.routes.js";
import path from "path"
import * as  fs from 'fs';
import https from 'https';
import http from 'http';

config();
let app = express();
const PORT = process.env.PORT || 3333;
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
  }));
app.use(cors({
    origin:"*"
}));

// SSLCertificateFile /etc/letsencrypt/live/spinwin.shreyanshkataria.com/fullchain.pem
// SSLCertificateKeyFile /etc/letsencrypt/live/spinwin.shreyanshkataria.com/privkey.pem


connect();
app.use('/api/v1' , routeIndex);

app.get("/" , (req ,res ) => 
{
    res.send('<h1>Api is working...</h1>');
});

app.get("/image/:filename" , ( req:Request , res :Response):any => 
{
    try
    {
        const filename = req.params.filename;
        const filePath = path.join(path.resolve(), "uploads", filename);
        return res.sendFile(filePath);
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({ 
            success : false , 
            data : [],
            message : 'Something went wrong !'
        })
    }
})

let privateKey = fs.readFileSync('/etc/letsencrypt/live/spinwin.shreyanshkataria.com/privkey.pem' );
let certificate = fs.readFileSync('/etc/letsencrypt/live/spinwin.shreyanshkataria.com/fullchain.pem');
let server = https.createServer({
  key: privateKey,
  cert: certificate
}, app)

// let server = http.createServer(app);

server.listen(PORT , ()=>
{
    console.log("Listening server on Port : " , PORT);
});

