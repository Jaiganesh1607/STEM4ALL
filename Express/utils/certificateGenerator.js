const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Ensure certificates directory exists
function ensureCertificatesDir() {
  const dir = path.join(__dirname, '..', 'public', 'certificates');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Generate certificate PDF
async function generateCertificate({ studentName, workshopTitle, dateCompleted, resultId }) {
  return new Promise((resolve, reject) => {
    try {
      const dir = ensureCertificatesDir();
      const filename = `certificate-${resultId}.pdf`;
      const filepath = path.join(dir, filename);
      
      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Certificate header
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .text('CERTIFICATE OF COMPLETION', { align: 'center' });
      
      doc.moveDown(1);
      
      // STEM4All branding
      doc.fontSize(16)
         .font('Helvetica')
         .text('STEM4All - Virtual STEM Workshops', { align: 'center' });
      
      doc.moveDown(2);
      
      // Certificate body
      doc.fontSize(14)
         .text('This is to certify that', { align: 'center' });
      
      doc.moveDown(0.5);
      
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text(studentName, { align: 'center', underline: true });
      
      doc.moveDown(1);
      
      doc.fontSize(14)
         .font('Helvetica')
         .text('has successfully completed the workshop', { align: 'center' });
      
      doc.moveDown(0.5);
      
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text(`"${workshopTitle}"`, { align: 'center' });
      
      doc.moveDown(2);
      
      // Date and certificate ID
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Date of Completion: ${new Date(dateCompleted).toLocaleDateString()}`, { align: 'center' });
      
      doc.moveDown(0.5);
      doc.text(`Certificate ID: ${resultId}`, { align: 'center' });
      
      // Footer
      doc.moveDown(3);
      doc.fontSize(10)
         .text('This certificate verifies successful completion of the workshop requirements', { align: 'center' });

      // Finalize PDF
      doc.end();
      
      stream.on('finish', () => {
        resolve(filepath);
      });
      
      stream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateCertificate };
