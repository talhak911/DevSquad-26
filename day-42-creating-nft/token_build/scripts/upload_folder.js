import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env from root
const envPath = '/home/talhak911/0Netixsol/DevSquad-26/day-41-creating-own-token/.env';
dotenv.config({ path: envPath });

const JWT = process.env.JWT;
if (!JWT) {
  console.error("JWT is missing from .env!");
  process.exit(1);
}

const metadataDir = '/home/talhak911/0Netixsol/DevSquad-26/day-41-creating-own-token/new-project/assets/metadata';
const files = fs.readdirSync(metadataDir);

const formData = new FormData();

// Pinata expects directory uploads to have files named foldername/filename in form-data
for (const file of files) {
  const filePath = path.join(metadataDir, file);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/json' });
  // Pass relative path folder/file.json so Pinata treats it as directory
  formData.append('file', blob, `metadata/${file}`);
}

// Add metadata properties
formData.append('pinataMetadata', JSON.stringify({
  name: 'TalhaNFT-Metadata'
}));

console.log("Uploading metadata folder to Pinata...");

try {
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JWT}`
    },
    body: formData
  });

  const data = await response.json();
  if (response.ok) {
    console.log("SUCCESS! Folder pinned to IPFS.");
    console.log("Folder CID:", data.IpfsHash);
    console.log(`baseURI will be: ipfs://${data.IpfsHash}/`);
  } else {
    console.error("ERROR uploading folder:", data);
  }
} catch (error) {
  console.error("Request failed:", error);
}
