//Using Express

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors())

//sample in memoery storgare
//let todos = [];

//connnecting mongoDb
mongoose.connect('mongodb://localhost:27017/mern-app').then(() => {
    console.log('DB connected')
}).catch((error) => {
    console.log(error)
})


//create schema
const todoSchema = new mongoose.Schema({
    title:{
            required: true,
            type:String
        },
    description: String
})

//create modal
const todoModal = mongoose.model('Todo', todoSchema);

//create a todo item
app.post('/todos', async(req,res) => {
   const {title,description} = req.body;
    try{
        const newTodo = new todoModal({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
})

//Get all items
app.get('/todos',async(req,res) => {
    try{
        const todos = await todoModal.find();
        res.json(todos);
    }catch(error){
        console.log(error)
        res.status(500).json({message : error.message})
    }
})

//update a todo item
app.put('/todos/:id', async (req,res) => {
    try{
        const {title,description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModal.findByIdAndUpdate(
            id,
            {title,description},
            {new : true}
        )
    
        if(!updatedTodo){
            return res.status(404).json({message:"to do not found"})
        }
        res.json(updatedTodo)
    }catch (error){
        console.log(error)
        res.status(500).json({message : error.message})
    }
   
})

//delete a todo item
app.delete('/todos/:id', async (req,res) => {
    try{
        const id = req.params.id;
        await todoModal.findByIdAndDelete(id)
        res.status(204).end();
    }catch (error){
        console.log(error)
        res.status(500).json({message : error.message})
    }
   
})

//start the server
const port = 8000;
app.listen(port,() => {
    console.log("server listerning to port " + port )
})

