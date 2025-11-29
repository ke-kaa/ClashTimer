import mongoose from 'mongoose';

export const isId = (id) => mongoose.Types.ObjectId.isValid(id);