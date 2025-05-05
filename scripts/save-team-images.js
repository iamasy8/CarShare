const fs = require('fs');
const path = require('path');

// Create the team directory if it doesn't exist
const teamDir = path.join(process.cwd(), 'public', 'team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

// Base64 encoded image data for Maryam (first image in the chat)
// Since we can't directly use the image from the chat, you'll need to replace this with the actual base64 data
// For now, just creating empty files
fs.writeFileSync(path.join(teamDir, 'maryam.jpg'), Buffer.from(''));
console.log('Created maryam.jpg');

// Placeholders for the other team members
fs.writeFileSync(path.join(teamDir, 'thomas.jpg'), Buffer.from(''));
console.log('Created thomas.jpg');

fs.writeFileSync(path.join(teamDir, 'julie.jpg'), Buffer.from(''));
console.log('Created julie.jpg');

fs.writeFileSync(path.join(teamDir, 'alexandre.jpg'), Buffer.from(''));
console.log('Created alexandre.jpg');

console.log('Created placeholder files for team member images');
console.log('Please manually replace these with the actual images from the conversation'); 