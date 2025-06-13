import express from 'express';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

// GET /api/blog - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, isPublished, author, limit = 10, page = 1 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (author) filter.author = author;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const blogPosts = await BlogPost.find(filter)
      .populate('author', 'name position image')
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await BlogPost.countDocuments(filter);
    
    res.json({
      posts: blogPosts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// GET /api/blog/:slug - Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'name position image bio');
      
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment views
    blogPost.views += 1;
    await blogPost.save();
    
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

// POST /api/blog - Create new blog post
router.post('/', async (req, res) => {
  try {
    const blogPost = new BlogPost(req.body);
    const savedBlogPost = await blogPost.save();
    const populatedPost = await BlogPost.findById(savedBlogPost._id)
      .populate('author', 'name position image');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
});

// PUT /api/blog/:id - Update blog post
router.put('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name position image');
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(blogPost);
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
});

// DELETE /api/blog/:id - Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
});

// GET /api/blog/category/:category - Get posts by category
router.get('/category/:category', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const blogPosts = await BlogPost.find({ 
      category: req.params.category, 
      isPublished: true 
    })
      .populate('author', 'name position image')
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
  }
});

export default router;
