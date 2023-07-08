const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const DATABASE_NAME = 'AkhileshDB';
const COLLECTION_NAME = 'todos';
const connectionString = 'mongodb+srv://AkhileshPratap:lBEXEb6gmpHykpa9@cluster0.nvusuta.mongodb.net/AkhileshDB?retryWrites=true&w=majority';
let db;

// Todo routes
const todosRouter = express.Router();
app.use('/todos', todosRouter);

//fetching data

todosRouter.route('/').get(async (req, res) => {
  try {
    const todos = await db.collection(COLLECTION_NAME).find().toArray();
    res.send(todos)
  } catch (error) {
    console.log('Error retrieving todos:', error);
    res.status(500).send('Internal Server Error');
  }
});

//adding

todosRouter.route("/add").post(async (req,res)=>{
  let data_object=req.body;
  try{
    let response= await db.collection(COLLECTION_NAME).insertOne(data_object)
    res.json(response)
  }
  catch(error){
    console.log("Unable to add todo:",error)
  }
})

//updating 

todosRouter.route("/update/:id").put(async (req,res)=>{
const RecordedId=req.params.id;
const body=req.body;
try {
  const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(RecordedId) },
    {
      $set: {
        todo_discription: body.todo_discription,
        todo_responsible: body.todo_responsible,
        todo_prioprity: body.todo_prioprity,
        todo_complete: body.todo_complete,
      },
    }
  );

  if (result.value) {
    res.send("Updated successfully");
  } else {
    res.status(404).send("Document not found");
  }
} catch (error) {
  console.log("An error occurred:", error);
  res.status(500).send("An error occurred");
}
})

//delete
todosRouter.route("/delete/:id").delete(async (req, res) => {
  let RecId = req.params.id;
  try {
    let deleteResult = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(RecId)
    });
    console.log(deleteResult)

    res.status(200).send(`Deleted ${deleteResult.deletedCount} document(s)`); // Send the response with the deleted count
  } catch (err) {
    console.log(err);
  }
});





// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    const client = await MongoClient.connect(connectionString, {
      useNewUrlParser: true,
    });

    db = client.db(DATABASE_NAME);
    console.log('Connected to MongoDB successfully');

    app.listen(4000, () => {
      console.log('Server started successfully');
    });
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

startServer();
