import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { DatabaseWithdrawalType } from "pec/lib/api/schemas/database/withdrawal";
import { User } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "withdrawals",
  },
})
export class Withdrawal implements DatabaseWithdrawalType {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, enum: DatabaseDocumentStatuses })
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
