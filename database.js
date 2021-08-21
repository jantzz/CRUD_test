const mongooseClient = require("mongoose");
const NotesSchema = mongooseClient.Schema({
    title:String,
    message: String},
    {timestamp: true}, 
)
const Notes = mongooseClient.model("Notes", NotesSchema);

//something 

mongooseClient.connect("mongodb://localhost/notepadDB", {useNewUrlParser:true, useUnifiedTopology:true}, (err) =>{
    if (err){ console.log(err)}
});

//model.export = Notes;
module.exports = Notes; 