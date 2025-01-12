import { model, models, Schema } from "mongoose";

export interface IImage extends Document {
    title: string;
    transformationTypes: string;
    publicId: string;
    secureUrl: URL;
    width?: number;
    height?: number;
    config?: Record<string, any>;
    transformationUrl?: URL;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
        _id: string;
        firstName: string;
        lastName: string
    }
    createdAt: Date;
    updatedAt: Date;
}



const ImageSchema = new Schema({
    title: { type: String, require: true },
    transformationTypes: { type: String, require: true },
    publicId: { type: String, require: true },
    secureUrl: { type: URL, require: true },
    width: { type: Number },
    height: { type: Number },
    config: {
        type: Object
    },
    transformationUrl: { type: URL },
    aspectRatio: { type: String }, color: { type: String },
    prompt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Image = models?.Image || model("Image", ImageSchema)
export default Image