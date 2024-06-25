const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const base64Img = require('base64-img');

const app = express();
const port = 5000;

// Connect to MongoDB
// mongodb+srv://veepthysuresh:5JoScaDUDLIINf7o@cluster0.xwmvod4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect('mongodb://localhost:27017/photofiesta', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const date = new Date();
var Sunday = new Date(date);
Sunday.setDate(date.getDate());

// Create a schema for the image model
const profileSchema = new mongoose.Schema({
  uid:String,
  name:String,
  email:String,
  place:String,
  bio:String,
  propic:{
    type:String,
    default:""
  }
}); 

const imageSchema = new mongoose.Schema({
  uid:String,
  caption: String,
  imgData : String,
  date: {
    type: String,
    default: new Date(Sunday.getFullYear(),Sunday.getMonth(),Sunday.getDate()).toString().substring(0,15)
  },
  likes: [String]
});


const commentSchema = new mongoose.Schema({
  mid: String,
  comments: {
    type: [String],
    default: []
  }
});


const contestSchema = new mongoose.Schema({
  uid:String,
  name:String,
  email:String,
  caption:String,
  imgData : String,
  date: {
  type: String,
    default: new Date(Sunday.getFullYear(),Sunday.getMonth(),Sunday.getDate()).toString().substring(0,15)
  }
});

const Profile = mongoose.model('Profile',profileSchema);
const Image = mongoose.model('Image', imageSchema);
const Comment = mongoose.model('Comment',commentSchema);
const Cont = mongoose.model('Cont', contestSchema);

app.use(bodyParser.json());
app.use(cors());

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to save user profile details into profile db
app.post('/api/profile', upload.single('image'), async (req, res) => {
  const { uid, name, email, place, bio } = req.body;
  const propic = req.file ? req.file.buffer.toString('base64') : "";

  try {
    // Find the profile by uid and update or create a new one if it doesn't exist
    const updatedProfile = await Profile.findOneAndUpdate(
      { uid: uid },
      { name, email, place, bio, propic },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: 'Profile saved successfully', profile: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to save image, caption, name, and email to MongoDB
app.post('/api/images', upload.single('image'), async (req, res) => {
  const {uid,caption} = req.body;
  const imgData = req.file.buffer.toString('base64');

  try {
    
    // If no image document found, create a new one
    
    const image = new Image({ uid, caption, imgData });

    // Save the updated image document
    await image.save();

    res.status(201).json({ message: 'Image saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to save image and details into constest db
app.post('/api/contest', upload.single('image'), async (req, res) => {
    const {uid,name, email, caption} = req.body;
    const imgData = req.file.buffer.toString('base64');
  
    try {
      const newImage = new Cont({uid,name, email, caption, imgData});
      await newImage.save();
      res.status(201).json({ message: 'Image saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/comment/:imageId/:comment', async (req, res) => {
  const imageId = req.params.imageId;
  const comment = req.params.comment;
  
  try {
    let com = await Comment.findOne({ mid: imageId });
    if (!com) {
      com = new Comment({ mid: imageId, comments: [comment] });
      
    } else {
      com.comments.push(comment);
    }

    await com.save();

    res.json({ message: 'Image liked successfully', likedImages: com.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/comment', async (req,res)=>{
  try {
    const comments = await Comment.find();
    res.json(comments);
  }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/like/:userId/:imageId', async (req, res) => {
  const userId = req.params.userId;
  const imageId = req.params.imageId;

  try {
    let image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const userIndex = image.likes.indexOf(userId);

    if (userIndex === -1) {
      // User has not liked the image yet, so add the like
      image.likes.push(userId);
      await image.save();
      res.json({ message: 'Image liked successfully', likes: image.likes });
    } else {
      // User has already liked the image, so remove the like
      image.likes.splice(userIndex, 1);
      await image.save();
      res.json({ message: 'Image unliked successfully', likes: image.likes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get user profile from MongoDB
app.get('/api/profile/:id', async (req, res) => {
  const uid = req.params.id;
  try {
    const user = await Profile.findOne({"uid":uid});
    if (user) {
      // console.log("i am sending"+user);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/images/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const images = await Image.find({ uid: userId });
    if (images.length > 0) {
      res.json(images);
    } else {
      res.status(404).json({ message: 'No images found for this user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get all images from MongoDB
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Endpoint to get all images from constest storage

app.get('/api/contest', async (req, res) => {
    try {
      const images = await Cont.find();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //delete user

app.delete('/api/profile/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Profile.findOne({uid:userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Profile.deleteOne( { uid : userId } )
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/images/:imageId', async (req, res) => {
  const imageId = req.params.imageId;

  try {
    const result = await Image.findByIdAndDelete(imageId);

    if (result) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});