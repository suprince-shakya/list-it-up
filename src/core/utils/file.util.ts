import * as path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import * as url from 'url';

const checkDirExists = (folderName: string) => {
	try {
		const uploadDirPath = path.join(__dirname, '../', '../', '../', 'public', 'uploads', folderName);
		if (!fs.existsSync(uploadDirPath)) {
			fs.mkdirSync(uploadDirPath, { recursive: true });
		}
	} catch (e) {
		console.log(e);
		throw e;
	}
};

export const saveFile = async (files: Express.Multer.File[], folderName: string) => {
	checkDirExists(folderName);

	// Process each file
	const uploadFiles: string[] = [];
	for (const file of files) {
		let outputBuffer: Buffer;
		let fileName: string;

		// Convert images to webp and compress to 90%
		if (file.mimetype.startsWith('image/')) {
			outputBuffer = await sharp(file.buffer).webp({ quality: 90 }).toBuffer();
			fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
		} else {
			outputBuffer = file.buffer as Buffer;
			fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
		}

		// Save the processed file to local storage
		let filePath: string;
		if (folderName) filePath = `public/uploads/${folderName}/${fileName}`;
		else filePath = `public/uploads/${fileName}`;
		fs.writeFileSync(filePath, outputBuffer);

		// Add file information to the uploadFiles array
		uploadFiles.push(`/uploads/${folderName}/${fileName}`);
	}
	return uploadFiles;
};

export const deleteFile = (fileName: string) => {
	const filePath = url.parse(fileName).path;
	try {
		const fullFilePath = path.join(__dirname, '../', '../', '../', 'public', filePath.toString());
		if (fs.existsSync(fullFilePath)) {
			fs.unlinkSync(fullFilePath);
		}
	} catch (e) {
		throw e;
	}
};
