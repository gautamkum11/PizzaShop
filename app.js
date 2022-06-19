const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const app1 = express();
app.set('view engine', 'ejs');
app1.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/PizzaDB");

app.use(bodyparser.urlencoded({urlencoded: true}));
app.use(express.static(__dirname));
app1.use(bodyparser.urlencoded({urlencoded: true}));
app1.use(express.static(__dirname+"/shop"));

const bioschema = {
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    address: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}

const bioschema1 = {
    pizzaname : {
        type: String,
        required: true
    },
    pizzasize: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    time: {
        type : Date
    }
}

const bioschema2 = {
    pizzaname : {
        type: String,
        required: true
    },
    pizzasize: {
        type: String,
        required: true
    },
    address : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    }
}

const bioschema3 = {
    pizzaid : {
        type: String,
        required: true
    },
    pizzastatus : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    time : {
        type : Date
    }
}

const Pizzauser = new mongoose.model("Pizzauser",bioschema);
const Pizzacart = new mongoose.model("Pizzacart",bioschema1);
const Shoppizza = new mongoose.model("Shoppizza",bioschema2);
const Statuspizza = new mongoose.model("Statuspizza",bioschema3);

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html"); 
});

app.get("/login",function(req,res)
{
    res.render("login");
});

app.get("/register",function(req,res)
{
    res.render("register");
});

app.get("/userp",function(req,res)
{
    res.render("user");
});

app.get("/cart",function(req,res)
{
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    const arr4 = [];
    const arr5 = [];
    var total = 0;
    res.render("cart",{
        addlist1 : arr1,
        addlist2 : arr2,
        addlist3 : arr3,
        addlist4 : arr4,
        addlist5 : arr5,
        totalamt : total
    });
});

app.post("/cart",function(req,res)
{
    const email = req.body.email;
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    const arr4 = [];
    const arr5 = [];
    Pizzacart.find({},function(err,founditems)
    {
        if(founditems.length === 0)
        {
            res.send("Your Cart is EMPTY !!!");
            // Item.insertMany(arr,function(err)
            // {
            //     if(err)
            //         console.log(error);
            //     else 
            //         console.log("Successfully saved..");
            // });
        }
        else 
        {
            var total = 0;
            founditems.forEach(function(elem)
            {
                if(elem.email === email)
                {
                    arr1.push(elem._id);
                    arr2.push(elem.pizzaname);
                    arr3.push(elem.pizzasize);
                    arr4.push("₹  "+elem.amount);
                    arr5.push(elem.time);
                    total += elem.amount;
                }
            });
            res.render("cart",{
                addlist1 : arr1,
                addlist2 : arr2,
                addlist3 : arr3,
                addlist4 : arr4,
                addlist5 : arr5,
                totalamt : total
            });
        }
    });
});

app1.get("/",function(req,res)
{
    const a1 = [];
    const a2 = [];
    const a3 = [];
    const a4 = [];
    const a5 = [];
    Shoppizza.find({},function(err,founditems)
    {
        if(founditems.length === 0)
        {
            res.send("No Orders TILL NOW !!")
            // Item.insertMany(arr,function(err)
            // {
            //     if(err)
            //         console.log(error);
            //     else 
            //         console.log("Successfully saved..");
            // });
        }
        else 
        {
            founditems.forEach(function(elem)
            {
                a1.push(elem.id);
                a2.push(elem.pizzaname);
                a3.push(elem.pizzasize);
                a4.push(elem.address);
                a5.push(elem.email);
            });
            res.render("index1",{
                addlist1 : a1,
                addlist2 : a2,
                addlist3 : a3,
                addlist4 : a4,
                addlist5 : a5
            });
        }
    });
});

app.post("/placeorder",function(req,res)
{
    Pizzacart.find({},function(err,founditems)
    {
        if(founditems.length === 0)
        {
            Item.insertMany(arr,function(err)
            {
                if(err)
                    console.log(error);
                else 
                    console.log("Successfully saved..");
            });
        }
        else 
        {
            founditems.forEach(function(elem)
            {
                const Orderdetail = new Shoppizza({
                    pizzaname : elem.pizzaname,
                    pizzasize : elem.pizzasize,
                    address : req.body.mainaddress,
                    email : elem.email,
                    id : elem.id
                });
                Orderdetail.save();
            });
        }
    });
    Pizzacart.deleteMany({},function(err)
    {
        if(err)
        console.log(error);
        else 
        console.log("Success");
    });
    res.send("succesfully placed Order !!");
});

app1.post("/checkstatus",function(req,res)
{
    const id = req.body.ids;
    const stat = req.body.cars;
    const email = req.body.email;
    const Statusdetail = new Statuspizza({
        pizzaid : id,
        pizzastatus : stat,
        email : email,
        time : Date.now()
    });
    Statusdetail.save();
    if(stat == "Complete")
    {
        Shoppizza.deleteOne({id: id},function(err)
        {
            if(err)
            console.log(error);
            else 
            console.log("Success");
        });
    }
});

app.get("/status",function(req,res)
{   
    const b1 = [];
    const b2 = [];
    const b3 = [];
    res.render("status",{
        addlist1 : b1,
        addlist2 : b2,
        addlist3 : b3
    });
});

app.post("/status",function(req,res)
{
    const b1 = [];
    const b2 = [];
    const b3 = [];
    Statuspizza.find({},function(err,founditems)
    {
        if(founditems.length === 0)
        {
            res.send("Status Page is Empty !!!");
            // Item.insertMany(arr,function(err)
            // {
            //     if(err)
            //         console.log(error);
            //     else 
            //         console.log("Successfully saved..");
            // });
        }
        else 
        {
            founditems.forEach(function(element)
            {
                if(element.email === req.body.email)
                {
                    b1.push(element.pizzaid);
                    b2.push(element.pizzastatus);
                    b3.push(element.time);
                }
            });
            res.render("status",{
                addlist1 : b1,
                addlist2 : b2,
                addlist3 : b3
            });
        }
    });
});

app.post("/userdashboard",function(req,res)
{
    const Userdetail = new Pizzauser({
        name : req.body.uname,
        contact: req.body.ucontact,
        address: req.body.uaddress,
        email: req.body.uemail,
        password: req.body.upassword
    });
    Userdetail.save();
    res.redirect("/login");
});


app.post("/cartdashboard",function(req,res)
{
    res.render("user",{
        n : req.body.username,
        e : req.body.useremail
    });
    const Pizzadetail = new Pizzacart({
        pizzaname : req.body.pname,
        pizzasize : req.body.psize, 
        amount : req.body.pamount,
        name : req.body.username,
        email : req.body.useremail,
        time : Date.now()
    });
    Pizzadetail.save();
});

app.post("/login",function(req,res)
{
    const email = req.body.rid; 
    const password = req.body.hpassword;
    Pizzauser.find({},function(err,founditems){
        if(founditems.length === 0)
        {
            Item.insertMany(arr,function(err)
            {
                if(err)
                    console.log(error);
                else 
                    console.log("Successfully saved..");
            });
        }
        else  
        {
            founditems.forEach(function(element)
            {
                if(element.email === email && element.password === password)
                {
                    res.render("user",{
                        n : element.name,
                        e : element.email
                    }); 
                }
                // else 
                //  res.send("invalid username or password or if your are a New User then REGISTER first...");
            });
        }
    }); 
});

app.listen(3000,function(){
    console.log("Server started...");
});

app1.listen(3001,function(){
    console.log("Second server started Succesfully...");
});
