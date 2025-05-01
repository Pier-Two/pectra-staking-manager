import { modelOptions, prop } from "@typegoose/typegoose";
import { DatabaseWithdrawalType } from "pec/lib/api/schemas/database/withdrawal";
import { DatabaseDocumentStatuses } from "pec/types/app";
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "withdrawals",
  },
})
export class Withdrawal implements DatabaseWithdrawalType {
  @prop()
  public email?: string;

  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public validatorIndex!: number;

  @prop({ required: true })
  public withdrawalIndex!: number;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public txHash!: string;
}
