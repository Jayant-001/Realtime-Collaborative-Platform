import fs from "fs";
import path from "path";
import os from "os";
import { rimraf } from "rimraf"; // To delete folder recursively
import { v4 as uuidv4 } from "uuid"; // For generating a unique folder name

class FolderService {
    // Function to create temp folder
    async createTempFolder() {
        // Generate a unique folder name using UUID
        const folderName = uuidv4();
        // const folderName = "my_code_folder";
        const folderPath = path.join(os.tmpdir(), folderName); // Temporary folder in system temp directory

        // Check if the folder exists, if it does, delete it or empty it
        if (fs.existsSync(folderPath)) {
            console.log("Folder already exists, deleting...");
            rimraf.sync(folderPath); // Delete the folder and all its contents
        }

        // Create the temporary folder
        try {
            fs.mkdirSync(folderPath);
            return folderPath;
        } catch (err) {
            console.error("Error while creating temp folder and files:", err);
            throw err;
        }
    }

    // At folderPath create 2 files [main.cpp, input.txt] and save content to files
    async saveCodeToFolder(folderPath, content) {
        try {
            // Define file paths
            const mainCppPath = path.join(folderPath, "main.cpp");
            const inputPath = path.join(folderPath, "input.txt");

            // Write content to main.cpp
            fs.writeFileSync(mainCppPath, content.code);

            // Write content to input.txt
            fs.writeFileSync(inputPath, content.input);

            // Return both relative and absolute paths
            return {
                relativePath: folderPath,
                absolutePath: path.resolve(folderPath),
            };
        } catch (error) {
            console.error("Error while creating temp folder and files:", error);
            throw error;
        }
    }

    // Function to delete the folder and all its contents
    async deleteFolder(folderPath) {
        if (fs.existsSync(folderPath)) {
            rimraf.sync(folderPath); // Delete the folder and all its contents
            console.log("Deleted folder:", folderPath);
        }
    }
}

export default FolderService;
