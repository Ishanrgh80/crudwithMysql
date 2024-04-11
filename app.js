require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//mysql
const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : 'Kryptonball#21',
    database : 'nodejs_beers',
}); 

//get all beers
app.get('/beers',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connection as thread id from connectionPool ${connection.threadId}`);

        //writing query
        connection.query('SELECT * from beers',(err,rows)=>{
            connection.release();

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        });

    });
});

//get particular query
app.get('/beers/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log(`connection as id from connectionPool ${connection.threadId}`);

        //writing query
        connection.query('SELECT * from beers WHERE id = ?', [req.params.id],(err,rows)=>{
            connection.release();

            console.log("Geeting results",req.params);

            if(!err){
                //console.log("Geeting resukts",req.params);
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//delete a record 
app.delete('/beers/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('connection id', connection.threadId);

        //writing query
        connection.query('DELETE from beers WHERE id = ?',[req.params.id],(err,rows)=>{
            connection.release();
            if(!err){
                res.send(`Beer with record id ${[req.params.id]} is been deleted`);
            } else {
                console.log(err);
            }
        })
    })
})

// Add a record
app.post('/beers/',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('connection id from the pool is', connection.threadId);

        const params = req.body;
        //writing query
        connection.query('INSERT INTO beers SET ?',[params],(err,rows)=>{
            connection.release();
            if(!err){
                res.send(`Beer with name ${params.name} has been added`);
            }else{
                console.log(err);
            }
        })
        console.log(req.body);
    })
});

//update a record
app.put('/beers/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){return res.status(500).send('Internal Server Error');} 
        console.log('Connection thread is', connection.threadId);

        const{name, tagline, description, image} = req.body;    
        const id = req.params.id;

        //writing query
        connection.query('UPDATE beers SET name =? ,tagline = ? , description = ? WHERE id = ?',[name,tagline,description,id],(err,rows)=>{
            connection.release();
            if(!err || row){
                res.send(`Beer with name ${name} has been updated with ${tagline} and ${description}`);
            }else{
                res.status(404).send("Something wrong while running the query");
                console.log(err);
            }
        })
        console.log(req.body);
    })
})



app.listen(port,()=>{
    console.log(`Server running on port : ${port}`);
})