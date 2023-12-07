import fs from 'fs';

export default function(filePath) {
    var targetPath = filePath.replace('sass', 'styles').replace('.scss', '.css');
    if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath)
    }

};