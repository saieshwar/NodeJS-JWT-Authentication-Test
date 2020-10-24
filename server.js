const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const exjwt = require('express-jwt');
const { json } = require('body-parser');


app.use((req,res, next) =>{
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
        next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const secretKey = 'My super secret Key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']

});
let users = [
    {
        id: 1,
        username: 'Sai',
        password: '123'
    },
    {
        id:2,
        username: 'eshwar',
        password: '456'
    }
];

var found;
app.post('/api/login', (req,res) => {
   const{username, password} = req.body;
   for(let user of users){
       if(username== user.username && password == user.password){
           found = true;
           let token = jwt.sign({
               id: user.id,
               username: user.username
             }, secretKey, { expiresIn: '1m'});
            res.json({
                success: true,
                err: null, 
                token
            });
            break; 
       }
    }

      if(!found){
           res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
           });
        }
   
   
});


app.get('/api/dashboard', jwtMW, (req,res) =>{
    //console.log(req);
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see'
    });
});

app.get('/api/settings', jwtMW, (req,res) => {
    res.json({
        success: true,
        Content: 'Settings can be accessible only by logged in accounts'
    });
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.use(function(err,req,res,next){
    if(err.name == 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'username or password is incorrect 2'
        });
        
    }
    else {
        next(err);
    }
});





app.listen(PORT,()=> {
    console.log(`serving on port ${PORT}`);
}); 

