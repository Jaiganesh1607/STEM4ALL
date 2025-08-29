const path = require('path');
const fs = require('fs');
const Result = require('../models/Result');
const Workshop = require('../models/Workshop');

// Stream certificate PDF for a result
exports.streamCertificate = async (req, res) => {
  try {
    const { resultId } = req.params;
    
    // Find the result
    const result = await Result.findById(resultId).populate('studentId', 'name');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    
    // Check workshop ownership
    const workshop = await Workshop.findById(result.workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    
    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isStudent = req.user.id === result.studentId._id.toString();
    
    if (!isOwner && !isAdmin && !isStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if certificate exists
    if (!result.certificateUrl) {
      return res.status(404).json({ message: 'Certificate not generated yet' });
    }

    // Get certificate file path
    const certificatePath = path.resolve(result.certificateUrl);
    
    // Check if file exists
    if (!fs.existsSync(certificatePath)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }

    // Stream the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=certificate-${resultId}.pdf`);
    
    const fileStream = fs.createReadStream(certificatePath);
    fileStream.pipe(res);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get certificate download URL
exports.getCertificateUrl = async (req, res) => {
  try {
    const { resultId } = req.params;
    
    const result = await Result.findById(resultId);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    
    // Check workshop ownership
    const workshop = await Workshop.findById(result.workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    
    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isStudent = req.user.id === result.studentId.toString();
    
    if (!isOwner && !isAdmin && !isStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!result.certificateUrl || !result.passed) {
      return res.status(404).json({ message: 'Certificate not available' });
    }

    res.json({ 
      certificateUrl: `/api/certificates/${resultId}/download`,
      passed: result.passed,
      score: result.score
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
