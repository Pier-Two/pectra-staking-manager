import { modelOptions, prop } from "@typegoose/typegoose";
import { DatabaseDocumentStatuses } from "pec/types/app";
import {
  SUPPORTED_NETWORKS_IDS,
  type SupportedNetworkIds,
} from "pec/constants/chain";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "deposits",
  },
})
export class Deposit {
  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public validatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;

  @prop()
  public email?: string;

  @prop({ required: true, enum: SUPPORTED_NETWORKS_IDS as readonly number[] })
  public networkId!: SupportedNetworkIds;

  @prop({ required: true })
  public amount!: number;
}
