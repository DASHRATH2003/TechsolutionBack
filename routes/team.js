import express from 'express';
import TeamMember from '../models/TeamMember.js';

const router = express.Router();

// GET /api/team - Get all team members
router.get('/', async (req, res) => {
  try {
    const { isLeadership, isActive } = req.query;
    const filter = {};
    
    if (isLeadership !== undefined) filter.isLeadership = isLeadership === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const teamMembers = await TeamMember.find(filter).sort({ order: 1, joinDate: -1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error: error.message });
  }
});

// GET /api/team/:id - Get single team member
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team member', error: error.message });
  }
});

// POST /api/team - Create new team member
router.post('/', async (req, res) => {
  try {
    const teamMember = new TeamMember(req.body);
    const savedTeamMember = await teamMember.save();
    res.status(201).json(savedTeamMember);
  } catch (error) {
    res.status(400).json({ message: 'Error creating team member', error: error.message });
  }
});

// PUT /api/team/:id - Update team member
router.put('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json(teamMember);
  } catch (error) {
    res.status(400).json({ message: 'Error updating team member', error: error.message });
  }
});

// DELETE /api/team/:id - Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error: error.message });
  }
});

// GET /api/team/leadership - Get leadership team
router.get('/leadership', async (req, res) => {
  try {
    const leadership = await TeamMember.find({ 
      isLeadership: true, 
      isActive: true 
    }).sort({ order: 1, joinDate: -1 });
    res.json(leadership);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leadership team', error: error.message });
  }
});

export default router;
