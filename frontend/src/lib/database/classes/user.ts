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
  // Doesn't have to be unique because users may have multiple wallets but want to use the same email
  @prop({ required: false })
  public email?: string;

  @prop({ required: true, unique: true })
  public address!: string;

  @prop({ required: false })
  public firstName?: string;

  @prop({ required: false })
  public lastName?: string;

  @prop({ required: false })
  public companyName?: string;
}
