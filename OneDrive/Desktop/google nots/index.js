const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const form = require("./models/form.js");
main()
.then((res)=>{
    // console.log(res);
    console.log("connection successful");
}
)
.catch((err)=>console.log(err));
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/google-form");
};
app.set("views",path.join(__dirname,"views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
const methodOverride = require("method-override");
// const chat = require("./models/chat.js");
app.use(methodOverride("_method"))
// const newform = new form({
//     title: " workout session.",
//     description : " i will start it from tomorrow",
//     createdAt : new Date(),
// });
// newform.save().then((res)=>{
//     console.log(res);
// });
app.listen(8080,()=>{
    console.log("you are listening to the port 8080");
});
app.get("/form" , async(req,res)=>{
    let forms = await form.find();
     res.render("index.ejs",{forms});
});
app.post("/form",(req,res)=>{
    let {title,description } = req.body;
    let newform = new form ({
        title : title ,
        description : description,
        createdAt : new Date(),
    });
    newform.save().then((res)=>{
        console.log("saved")
    });
    res.redirect("/form");
});
app.get("/form/:id/edit",async(req,res)=>{
    let {id}=req.params;
      let editform =  await form.findById(id);
        res.render("edit.ejs",{editform});
})
app.put("/form/:id",async(req,res)=>{
    let {id}=req.params;
    let {title : newtitle , description : newdescription} = req.body;
    let updatedform = await form.findByIdAndUpdate(id , {
        title : newtitle , description : newdescription},
    {runValidators:true,new:true}
);
res.redirect("/form");
 });
 app.delete("/form/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedform = await form.findByIdAndDelete(id);
    res.redirect("/form");
 });