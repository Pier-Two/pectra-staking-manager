import { modelOptions, prop } from "@typegoose/typegoose";
import { DatabaseDocumentStatuses } from "pec/types/app";
import {
  SUPPORTED_NETWORKS_IDS,
  type SupportedNetworkIds,
} from "pec/constants/chain";
import { StoreDatabaseDepositType } from "pec/lib/api/schemas/deposit";

// Define DepositEntry as a class
class DepositEntry {
  @prop({ required: true })
  public publicKey!: string;

  @prop({ required: true })
  public validatorIndex!: number;

  @prop({ required: true })
  public amount!: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "deposits",
  },
})
export class Deposit implements StoreDatabaseDepositType {
  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true, type: () => [DepositEntry] })
  public deposits!: DepositEntry[];

  @prop({ required: true })
  public txHash!: string;

  @prop()
  public email?: string;

  @prop({ required: true, enum: SUPPORTED_NETWORKS_IDS, type: Number })
  public networkId!: SupportedNetworkIds;

  // Timestamp fields added by Mongoose/Typegoose
  public createdAt!: Date;
  public updatedAt!: Date;
}
