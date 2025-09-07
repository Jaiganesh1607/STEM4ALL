const path = require('path');
const fs = require('fs');
const Workshop = require('../models/Workshop');

// Upload workshop resource file
exports.uploadWorkshopResource = async (req, res) => {
  try {
    const { workshopId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find workshop and check ownership
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      // Clean up uploaded file if workshop not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      // Clean up uploaded file if no permission
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add file info to workshop
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      filepath: req.file.path,
      filesize: req.file.size,
      mimetype: req.file.mimetype
    };

    workshop.resourceFiles.push(fileInfo);
    await workshop.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: workshop.resourceFiles[workshop.resourceFiles.length - 1]._id,
        filename: fileInfo.originalName,
        size: fileInfo.filesize,
        uploadedAt: new Date()
      }
    });

  } catch (error) {
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

// Download workshop resource file
exports.downloadWorkshopResource = async (req, res) => {
  try {
    const { workshopId, fileId } = req.params;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const file = workshop.resourceFiles.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Check if file exists on disk
    if (!fs.existsSync(file.filepath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    
    // Stream file to client
    const fileStream = fs.createReadStream(file.filepath);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete workshop resource file
exports.deleteWorkshopResource = async (req, res) => {
  try {
    const { workshopId, fileId } = req.params;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const file = workshop.resourceFiles.id(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete file from disk
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    // Remove from database
    workshop.resourceFiles.pull(fileId);
    await workshop.save();

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List workshop files
exports.listWorkshopFiles = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const files = workshop.resourceFiles.map(file => ({
      id: file._id,
      filename: file.originalName,
      size: file.filesize,
      type: file.mimetype,
      uploadedAt: file.uploadedAt,
      downloadUrl: `/api/instructor/workshops/${workshopId}/files/${file._id}/download`
    }));

    res.json(files);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
