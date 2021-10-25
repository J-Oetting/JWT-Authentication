const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note }} = require('./db');
const path = require('path');

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/:userId/notes', async (req, res) => { 
  // const user = await User.findOne({
  //   where: { id: req.params.userId }
  // })
  // const notes = user.getNotes();
  const user = await User.byToken(req.headers.authorization);
  console.log('params', req.params.userId, typeof req.params.userId);
  console.log('userId', user.id, typeof user.id);
  const newUserId = user.id.toString()
  if (req.params.userId === newUserId){
    const notes = await Note.findAll({
      where: { userId: req.params.userId } 
    })
    res.json(notes);
  } else {
    res.sendStatus(403);
  }
})

app.post('/api/auth', async(req, res, next)=> {
  try {
    res.send({ token: await User.authenticate(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth', async(req, res, next)=> {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;