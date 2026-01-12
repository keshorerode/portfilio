import { PortfolioConfig } from '../types/portfolio';
import connectDB from './mongodb';
import Information from '../models/Information';
import { getConfig } from './config-loader';

export const getConfigFromDB = async (): Promise<PortfolioConfig> => {
    try {
        await connectDB();
        const info = await Information.findOne({});
        if (info && info.config) {
            console.log('[CONFIG-DB] Successfully loaded config from MongoDB');
            return info.config as PortfolioConfig;
        }
    } catch (err) {
        console.warn('[CONFIG-DB] Failed to fetch from DB, falling back to local JSON:', err);
    }
    return getConfig();
};
