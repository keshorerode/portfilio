import mongoose, { Schema, model, models } from 'mongoose';

const InformationSchema = new Schema({
    config: {
        type: Schema.Types.Mixed,
        required: true,
    }
}, {
    collection: 'information',
    timestamps: true
});

const Information = models.Information || model('Information', InformationSchema);

export default Information;
