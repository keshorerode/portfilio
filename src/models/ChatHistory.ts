import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatHistorySchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: 'chathistory',
    timestamps: true
});

const ChatHistory = models.ChatHistory || model('ChatHistory', ChatHistorySchema);

export default ChatHistory;
