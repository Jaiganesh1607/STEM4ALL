const Workshop = require('../models/Workshop');

// Create new workshop
exports.createWorkshop = async (req, res) => {
  try {
    const { title, description, date, videoLink, resourceLink } = req.body;
    
    const workshop = await Workshop.create({
      title,
      description,
      date: new Date(date),
      videoLink,
      resourceLink: resourceLink || null,
      createdBy: req.user.id,
    });
    
    res.status(201).json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// List instructor's workshops
exports.listMyWorkshops = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const workshops = await Workshop.find(query).sort({ date: -1 });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming workshops for dashboard
exports.getUpcomingWorkshops = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    query.date = { $gte: new Date() }; // Only future workshops
    
    const workshops = await Workshop.find(query)
      .sort({ date: 1 })
      .limit(10);
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get workshop detail
exports.getWorkshopDetail = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    
    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update workshop
exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, date, videoLink, resourceLink } = req.body;
    
    if (title) workshop.title = title;
    if (description) workshop.description = description;
    if (date) workshop.date = new Date(date);
    if (videoLink) workshop.videoLink = videoLink;
    if (resourceLink !== undefined) workshop.resourceLink = resourceLink;

    await workshop.save();
    res.json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete workshop
exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await workshop.deleteOne();
    res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
