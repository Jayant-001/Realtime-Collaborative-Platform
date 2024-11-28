import FolderService from "./utils/folderService.js";
import { exec } from "child_process";

const folderService = new FolderService();

const processCode = async (content) => {
    const tempFolderPath = await folderService.createTempFolder();
    await folderService.saveCodeToFolder(tempFolderPath, content);

    return new Promise((resolve, reject) => {
        const command = `docker run --rm -v "${tempFolderPath}:/app" gcc:latest sh -c "g++ /app/main.cpp -o /app/main && /app/main < /app/input.txt"`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                reject(`Error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.log(`Stderr: ${stderr}`);
                reject(`Stderr: ${stderr}`);
                return;
            }

            await folderService.deleteFolder(tempFolderPath);

            resolve(stdout);
        });
    });
};

export default processCode;
