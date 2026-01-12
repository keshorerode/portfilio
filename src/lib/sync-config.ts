import fs from 'fs';
import path from 'path';
import connectDB from '../lib/mongodb';
import Information from '../models/Information';

async function syncPortfolioConfig() {
    try {
        await connectDB();

        const configPath = path.join(process.cwd(), 'portfolio-config.json');
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // We update the single configuration document or create it if it doesn't exist
        const updatedInfo = await Information.findOneAndUpdate(
            {}, // Match the first document found
            {
                config: configData,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        console.log('Portfolio configuration synced to MongoDB successfully.');
        return updatedInfo;
    } catch (error) {
        console.error('Error syncing portfolio configuration:', error);
        throw error;
    }
}

export default syncPortfolioConfig;
