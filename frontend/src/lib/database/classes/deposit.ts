import { modelOptions, prop } from "@typegoose/typegoose";
import { DatabaseDocumentStatuses } from "pec/types/app";
import { DatabaseDepositType } from "pec/lib/api/schemas/database/deposit";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "deposits",
  },
})
export class Deposit extends TimeStamps implements DatabaseDepositType {
  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public validatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;

  @prop()
  public email?: string;
}
