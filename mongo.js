
const mongoose = require('mongoose');

if(process.argv.length < 3){
  console.log('Please provide the password as an argument : node mongo.js');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rahuldesar:${password}@cluster0.tn7lddt.mongodb.net/blogApp?retryWrites=true&w=majority`;

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blogs = mongoose.model('Blogs', blogSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Database Connected.");


    Blogs.find({}).then(result => {
      result.forEach(blog => {
        console.log(blog)
      })
      mongoose.connection.close()
    })
  })


  // const note = new Note({
  //   content : "This is note 1",
  //   date : new Date(),
  //   important : true,
  // })
  // return note.save();
  // })
  // .then(() => {
  //   console.log('note saved');
  //   const note2 = new Note({
  //     content : "This is note 2",
  //     date : new Date(),
  //     important : true,
  //   })
  //   return note2.save();
  // })
  // .then(() => {
  //   console.log('note2 saved');
  //   const note3 = new Note({
  //     content : "This is note 3",
  //     date : new Date(),
  //     important : true,
  //   })
  //   return note3.save();
  // })
  // .then (() =>{
  //   console.log("Note3 saved");
  //   return mongoose.connection.close();
  // })

  .catch(() => console.log(err));

