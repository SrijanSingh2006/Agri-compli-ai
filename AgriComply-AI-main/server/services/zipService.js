const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Document = require('../models/Document');

exports.createBundle = async (userId, docTags, outputName, res) => {
  // 1. Fetch all file records for this user
  const allDocs = await Document.findByUserId(userId);
  
  // 2. Filter: Only select documents that match the required tags (e.g., 'PAN', 'ITR')
  const docsToZip = allDocs.filter(doc => docTags.includes(doc.tag));

  if (docsToZip.length === 0) {
    throw new Error("No matching documents found in Vault to zip.");
  }

  // 3. Set Response Headers: Tell the browser this is a downloadable file
  res.attachment(`${outputName}.zip`);

  // 4. Initialize Archiver
  const archive = archiver('zip', {
    zlib: { level: 9 } // Best compression
  });

  // 5. Pipe the archive data directly to the Express response (stream)
  archive.pipe(res);

  // 6. Append files from local storage to the ZIP
  docsToZip.forEach(doc => {
    const storedName = doc.file_path || doc.filename || doc.file_name;
    const absolutePath = path.isAbsolute(storedName)
      ? storedName
      : path.join(__dirname, '..', 'uploads', storedName || '');

    // Ensure the file actually exists on disk before adding
    if (storedName && fs.existsSync(absolutePath)) {
      const originalName = doc.file_name || doc.filename || path.basename(absolutePath);
      // Add file to zip, renaming it to something clean (e.g., "PAN.pdf")
      archive.file(absolutePath, { name: `${doc.tag}${path.extname(originalName)}` });
    } else {
      console.warn(`File missing from disk: ${absolutePath}`);
    }
  });

  // 7. Finalize the archive (This triggers the download on the client side)
  await archive.finalize();
};
