const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/Todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const Todo = require('./models/Todos');

app.get('/todos', async(req,res)=>{
  const todos = await Todo.find();

  res.json(todos);
})


app.post('/todo/new', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text
    });

    await todo.save(); // Wait for the promise to resolve
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/todo/delete/:id', async(req,res)=>{
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json(result);
})

app.put('/todo/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.complete = !todo.complete;
    await todo.save(); // Wait for the promise to resolve

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(3000, ()=> console.log("Server started on Port 3000"))
