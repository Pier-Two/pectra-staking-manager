import { modelOptions, prop } from "@typegoose/typegoose";
import {
  SUPPORTED_NETWORKS_IDS,
  type SupportedNetworkIds,
} from "pec/constants/chain";
import { DatabaseDocumentStatuses } from "pec/types/app";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "consolidations",
  },
})
export class Consolidation {
  @prop()
  public email?: string;

  @prop({ required: true, type: String })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public targetValidatorIndex!: number;

  @prop({ required: true })
  public sourceTargetValidatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;

  @prop({ required: true, enum: SUPPORTED_NETWORKS_IDS })
  public networkId!: SupportedNetworkIds;
}
