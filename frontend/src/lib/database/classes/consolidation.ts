import { modelOptions, prop } from "@typegoose/typegoose";
import { DatabaseConsolidationType } from "pec/lib/api/schemas/database/consolidation";
import { DatabaseDocumentStatuses } from "pec/types/app";
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "consolidations",
  },
})
export class Consolidation implements DatabaseConsolidationType {
  @prop()
  public email?: string;

  @prop({ required: true, enum: DatabaseDocumentStatuses })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public targetValidatorIndex!: number;

  @prop({ required: true })
  public sourceTargetValidatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;
}
