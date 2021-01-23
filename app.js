
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/TimeTableDB", {useNewUrlParser: true,useUnifiedTopology: true});



const subSchema={
  name:String,
  time:String,
  inputCode:String,
  password:String
};
const Sub=mongoose.model("Sub",subSchema);

const sub=new Sub({
});

const daySchema={
  name:String,
  items:[subSchema]
}
const Day=mongoose.model("Day",daySchema);

const day1 = new Day({
  name: "Monday"

});
const day2 = new Day({
  name: "Tuesday"

});
const day3 = new Day({
  name: "Wednesday"

});
const day4 = new Day({
  name: "Thursday"

});
const day5 = new Day({
  name: "Friday"

});
const day6 = new Day({
  name: "Saturday"

});
const day7 = new Day({
  name: "Sunday"

});
const dayArray=[day1,day2,day3,day4,day5,day6,day7];


const tableSchema={
  name:String,
  items:[daySchema]
};

const Table=mongoose.model("Table",tableSchema);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/",function(req,res){
  res.render("home");
});

app.get("/:customListName",function(req,res){
  let customListName=_.capitalize(req.params.customListName);

  Table.findOne({name:customListName},function(err,foundItem){
    if(!foundItem)
    {
      let table=new Table({
        name:customListName,
        items:dayArray
      });
      table.save();
      res.redirect("/"+customListName);
    }
    else
    {
      res.render("list",{title:customListName,items:foundItem.items});
    }
  });
  });


app.post("/",function(req,res){

  let day=req.body.button;
  let arr=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  chk=arr.findIndex(function(a){
    return a===day;
  });
  let title=req.body.title;
  let name=req.body.name;
  let time=req.body.time;
  let inputCode=req.body.inputCode;
  let password=req.body.password;
  const sub=new Sub({
    name:name,
    time:time,
    inputCode:inputCode,
    password:password
  });

  Table.findOne({name:title},function(err,foundItem){
    foundItem.items[chk].items.push(sub);
    foundItem.save();
    res.redirect("/"+title);
});
});

app.post("/delete",function(req,res){
  let title=req.body.listType;
  let day=req.body.day;
  let id=req.body.checkbox;
  let arr=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  chk=arr.findIndex(function(a){
    return a===day;
  });
  Table.findOne({name: title}, function(err, foundItem){
      let here=foundItem.items[chk].items.findIndex(arr=>{
        return arr._id===id;
      });
      foundItem.items[chk].items.splice(here,1);
      foundItem.save();
      res.redirect("/" + title);
  });
});


app.listen(3000,function(){
  console.log("Server is running on port 3000");
});
