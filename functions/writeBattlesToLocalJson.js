import { readdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';

export async function handler() {
    const battlesDir = join(process.cwd(), 'contents/battle');
    const battlesFile = join(battlesDir, 'battles.json');

    try {
        // Read all entries in the directory
        const files = await readdir(battlesDir);

        // Filter directories
        const subDirs = await Promise.all(
            files.map(async file => {
                const filePath = join(battlesDir, file);
                const stats = await stat(filePath);
                return stats.isDirectory() ? file : null;
            })
        );

        // Write the battles.json file
        await writeFile(subDirs, JSON.stringify(battles, null, 2), 'utf8');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'battles.json updated successfully', battles })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error: ${error.message}`
        };
    }
}
