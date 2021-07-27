const express= require("express");
const path = require("path");
const app = express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));

app.set("view engine","ejs");  //tells express which engine is used
app.set("views",__dirname);    //

app.get('/register', function (req, res) {
   res.sendFile(path.join(__dirname + "/register.html"));
  });
 
  app.get('/internships', function (req, res) {
   res.sendFile(path.join(__dirname + "/internship.html"));
  });
  app.post('/save',(req,res)=>{
   const fname=req.body.fname;
   const lname=req.body.lname;
   const email=req.body.email;
   const password=req.body.password;
   const cpassword=req.body.cpassword;
  var data={fname:fname,lname:lname,email:email,password:password,cpassword:cpassword};
  var mysql=require("mysql");
  var connection=mysql.createConnection(
     {
        host:"localhost",
        user:"root",
        password:"",
        database:"aman_db",

     }
  );
  connection.connect();
  connection.query("INSERT INTO authentication SET ?",data,function(err,result,fields){
     if(err) throw err;
     console.log("data inserted");
  });
  connection.end();
  return res.redirect('/application');
   });
  app.listen(3002);
  console.log("server running at 3002");


  app.get('/admin', function (req, res) {
   res.sendFile(path.join(__dirname + "/admin.html"));
  });

  app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + "/home.html"));
  });

  app.get('/application', function (req, res) {
  res.render('application'); // res.sendFile(path.join(__dirname + "/application.html"));
  });
  app.post('/apply',(req,res)=>{
   const fname=req.body.fname;
   const lname=req.body.lname;
   const dob=req.body.dob;
   const phno=req.body.phno;
   const email=req.body.email;
   const address=req.body.address;
   const city=req.body.city;
   const state=req.body.state;
  var data={fname:fname,lname:lname,dob:dob,phno:phno,email:email,address:address,city:city,state:state};
  var mysql=require("mysql");
  var connection=mysql.createConnection(
     {
        host:"localhost",
        user:"root",
        password:"",
        database:"aman_db",
     }
  );
  connection.connect();
  connection.query("INSERT INTO candidates SET ?",data,function(err,result,fields){
     if(err) {throw err;}
     else{
     console.log("data inserted");
     res.render("application", {error:'applied'});
     } 
  });
  connection.end();
 
     });

 
 
 
 


 
  

 
  app.get('/results', function (req, res) {
   var mysql=require("mysql");
   var connection=mysql.createConnection(
      {
         host:"localhost",
         user:"root",
         password:"",
         database:"aman_db",
 
      }
   );
   connection.connect();
   connection.query("SELECT candidates.fname,candidates.lname,candidates.dob,candidates.selected,candidates.email,candidates.phno FROM candidates WHERE candidates.selected=1",function(err,result){
      if(err) throw err;
      console.log(result);
      res.render("results",{bdata:result});
   });
  connection.end();
   });
 

   app.get('/admin2', function (req, res) {
      var mysql=require("mysql"); 
   var connection=mysql.createConnection(
      {
         host:"localhost",
         user:"root",
         password:"",
         database:"aman_db",
 
      }
   );
   connection.connect();
   connection.query("SELECT * FROM candidates",function(err,result){
      if(err) throw err;
      console.log(result);
      res.render("admin2",{bdata:result});
   });
  connection.end();
  //res.sendFile(path.join(__dirname + "/admin2.html"));
   });
 
 
 
 
 
 
 
 
 
 
 
 
  app.get('/login', function (req, res) {
   res.sendFile(path.join(__dirname + "/login.html"));
  });
   app.post("/loginAuth", (req,res)=>{
   const email=req.body.email;
   const password=req.body.password;
   var  mysql= require("mysql");
  var connection= mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"aman_db",
   });
   connection.connect();
   console.log("connected to database");
   connection.query("SELECT * FROM authentication WHERE email=?",email,function(err,result){
      if(err){throw err}
      else{
         if(result.length==0){
            console.log("email/user not available");
            res.sendFile(path.join(__dirname + "/login.html"));
         }
         else if(result[0].password==password){
            console.log("login sucessfull");
            return res.redirect('/application');
                  }
         else{
            console.log("email/password not valid");
            res.sendFile(path.join(__dirname + "/login.html"));
         
         }
      }
   })
   connection.end();
});



app.get('/loginAdmin', function (req, res) {
   res.sendFile(path.join(__dirname + "/admlogin.html"));
  });
   app.post("/loginAdmin", (req,res)=>{
   const email=req.body.email;
   const password=req.body.password;
   var  mysql= require("mysql");
   var connection= mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"aman_db",
   });
   connection.connect();
   console.log("connected to database");
   connection.query("SELECT * FROM admin WHERE email=?",email,function(err,result){
      if(err){throw err}
      else{
         if(result.length==0){
            console.log("email/user not available");
            res.sendFile(path.join(__dirname + "/admlogin.html"));
         }
         else if(result[0].password==password){
            console.log("login sucessfull");
            return res.redirect('/admin2');
         }
         else{
            console.log("email/password not valid");
            res.sendFile(path.join(__dirname + "/admlogin.html"));
         }
      }
   })
   connection.end();
});


app.get("/users/delete/(:id)", function (req, res) {
   var did = req.params.id; // id read from the front end
   var mysql = require("mysql"); //connect to database
   var connection = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "",
     database: "aman_db",
   });
   connection.connect();
   var sql = "DELETE FROM candidates WHERE id=?";
   connection.query(sql, did, function (err, result) {
     console.log("deleted record");
   });
   connection.end();
   res.redirect(req.get("referer"));
 });
 // delete end
 
 //accept or reject
 app.get("/users/edit/(:id)/(:s)", function (req, res) {
   var id = req.params.id; // get the id from FE
   var sel = req.params.s;
 
   if (sel == 0) {
     sel = 1;
   } else {
     sel = 0;
   }
   // connect to db
   var mysql = require("mysql");
   var connection = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "",
     database: "aman_db",
   });
   connection.connect();
   // query to accept or reject
 
   let udata = [sel, id];
   connection.query(
     "UPDATE candidates SET selected=? WHERE id=?",
     udata,
     function (err, res) {
       if (err) throw err;
       console.log("updated");
     }
   );
   connection.end();
   res.redirect(req.get("referer"));
 });
 
 

