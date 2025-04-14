import { modelOptions, prop, type Ref } from "@typegoose/typegoose";
import { DatabaseConsolidationType } from "pec/lib/api/schemas/database/consolidation";
import { User } from "./user";
import { DatabaseDocumentStatuses } from "pec/types/app";
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "consolidations",
  },
})
export class Consolidation implements DatabaseConsolidationType {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, enum: DatabaseDocumentStatuses })
  public status!: (typeof DatabaseDocumentStatuses)[number];

  @prop({ required: true })
  public targetValidatorIndex!: number;

  @prop({ required: true })
  public sourceTargetValidatorIndex!: number;

  @prop({ required: true })
  public txHash!: string;
}
