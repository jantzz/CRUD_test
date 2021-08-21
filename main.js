//declare constants 
const express = require('express');
const body_parser = require("body-parser");
const path = require('path');
const pug = require("pug");
const Notes = require("./database");
const updateRouter = require("./update-router");
const app = express();

app.set('view engine', 'pug'); //ise PUG on app routes 
app.set('views', path.join(__dirname, "views")); // specify folder of where puh files are 

app.use(body_parser.urlencoded({extended:true})); // use body parser to parse incoming data 

app.use(body_parser.json()); // requests parse in JSON 
app.use('/updatepage', updateRouter); // capture id when going to /updatepage

app.use((req,routes,next) =>{ 
    console.log(req.method + ":" + req.url);
    next();
}); 
//redirect page to /index when / is called 
app.get("/", (req, res ,next)=>{
    res.redirect('/index');
});
//Read 
app.get('/index', (req,res,next)=>{
    Notes.find({}).exec((err, document)=>{
        if(err) console.log(err);
        let Data =[];
        document.forEach((value) =>{
            Data.push(value);
        });
        res.render('view', {data:document});
    });
});
// Creation of Notes 
app.route("/notes-add")
.get((req,res,next)=>{
    res.render('notes-add');
})
.post((req,res,next)=>{
    console.log(req.body);
    const Note = new Notes({});

    Note.title = req.body.title;
    Note.message = req.body.message;

    Note.save((err, product)=>{
        if(err) console.log(err);
        console.log(product);
    });
    res.redirect('/index');
});
// Update 
app.get('/updatepage/:__id',(req,res)=>{
    console.log('id for get request: ' + req.id);
    Notes.findById(req.id,(err, document)=>{
        console.log(document);

        res.render('updatepage', {data:document});
    });
});

app.post('/updatepage', (req,res,next)=>{ 
    console.log('id: ' + req.id);
    Notes.findByIdAndUpdate(req.id,{title:req.body.title, message:req.body.message}, {useFindAndModify:false},(err, document)=>{
        console.log('updated');
    });
    res.redirect('/index');
    return next();
});

// Delete 
app.get("/delete/__id", (req,res,next)=>{
    Notes.findByIdAndRemove(req.params.__id, {useFindAndModify:false}, (err, document)=>{
        if(err) console.log(err);
        console.log(document);
    })
    res.redirect('/index');
})

app.listen(3000);
