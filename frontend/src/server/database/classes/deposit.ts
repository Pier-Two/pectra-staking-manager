import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { DatabaseDocumentStatuses } from "pec/types/app";
import {
  SUPPORTED_NETWORKS_IDS,
  type SupportedNetworkIds,
} from "pec/constants/chain";
import { StoreDatabaseDepositType } from "pec/lib/api/schemas/deposit";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "depositEntry",
  },
})
export class DepositEntry {
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
export class Deposit implements Omit<StoreDatabaseDepositType, "deposits"> {
  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true, ref: () => DepositEntry })
  public deposits!: Ref<DepositEntry>[];

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
