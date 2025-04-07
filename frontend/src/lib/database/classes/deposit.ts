import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { User } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";
import { DatabaseDepositType } from "pec/lib/api/schemas/database/deposit";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "deposits",
  },
})
export class Deposit implements DatabaseDepositType {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, enum: DatabaseDocumentStatuses })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public validatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;
}
