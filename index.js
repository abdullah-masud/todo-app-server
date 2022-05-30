const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6iamp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todoCollection').collection('todos');

        // GET todos from db based on email
        app.get('/todos', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const todos = await todoCollection.find(query).toArray();
            res.send(todos);

        })

        // POST todo into db
        app.post('/todo', async (req, res) => {
            const newTask = req.body;
            const result = await todoCollection.insertOne(newTask)
            res.send(result)
        })

        app.patch('/complete/:id', async (req, res) => {
            const id = req.params.id;
            const isComplete = req.body;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    isComplete: isComplete.isComplete
                }
            }
            const result = todoCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })

        // DELETE todo from db
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running To do App server')
});

app.listen(port, () => {
    console.log(`Listening to port ${port} `);
})


