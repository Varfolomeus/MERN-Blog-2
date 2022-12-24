import Post from '../models/Post.js';
import User from '../models/User.js';

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    // const post = await newPost.save();
    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    console.log(err, 'something went wrong with post creation');
    res.status(409).json({
      error: err.message,
      message:
        'Something went wrong with post creation. Posts data not correct',
    });
  }
};

// READ

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err, 'something went wrong with posts');
    res.status(404).json({
      error: err.message,
      message: 'Something went wrong with posts. Posts data not found',
    });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err, 'something went wrong with posts');
    res.status(404).json({
      error: err.message,
      message: 'Something went wrong with posts. Posts data not found',
    });
  }
};
// UPDATE

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // console.log('liking id', id);
    // console.log('liking userId', userId);

    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        likes: post.likes,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err, 'something went wrong with posts');
    res.status(404).json({
      error: err.message,
      message: 'Something went wrong with posts. Posts data not found',
    });
  }
};

// DELETE
