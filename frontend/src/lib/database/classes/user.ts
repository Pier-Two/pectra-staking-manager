import { modelOptions, prop } from "@typegoose/typegoose";
import { UserType } from "pec/lib/api/schemas/database/user";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: "users",
  },
})
export class User implements UserType {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, unique: true })
  public address!: string;
}
