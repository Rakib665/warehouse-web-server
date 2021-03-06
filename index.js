const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config()


// middleware

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boeyp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
try{
  await client.connect()
const inventoryCollection = client.db('warehouse').collection('items')
console.log('mg connect')
app.get('/inventory', async(req,res)=>{
  const query = {}
  const cursor = inventoryCollection.find(query)
  const items = await cursor.toArray()
  res.send(items)
})

app.get('/inventory/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)}
  const item = await inventoryCollection.findOne(query)
  res.send(item)
})

app.put('/inventory/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const updateQuantity = req.body
  // console.log(updateQuantity.quantity)
  const query = { _id: ObjectId(id) }
  const options = { upsert: true };

  const updateDoc = {
      $set: {
          quantity: updateQuantity.quantity,
         
      },
  };
  const result = await inventoryCollection.updateOne(query,updateDoc)
  res.send(result)
})


app.delete('/inventory/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)}
  const result = await inventoryCollection.deleteOne(query)
  res.send(result)
})

app.post('/inventory', async(req,res)=>{
  const addItem = req.body
  const newItem = inventoryCollection.insertOne(addItem)
  res.send(newItem)
})


}
finally{}


}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})