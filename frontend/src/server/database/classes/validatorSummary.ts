import { modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

/**
 * Collection that keeps a record of a summary of validator stats
 *
 * Primarily for the purposes of generate relevant charts
 */
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    collection: "validatorSummarys",
  },
})
export class ValidatorSummary extends TimeStamps {
  /**
   * Withdrawal credentials of the validator
   *
   * 0x00 - BLS Withdrawal Credentials (Legacy)
   * 0x01 - Ethereum Address Withdrawal Credentials (Shapella)
   * 0x02 - Smart Contract Withdrawal Credentials (Pectra)
   */
  @prop({ required: true })
  public withdrawalCredentialPrefix!: "0x00" | "0x01" | "0x02";

  /**
   * Total amount staked by validators using the specified withdrawal credentials
   *
   * Stored in Gwei
   */
  @prop({ required: true })
  public totalStaked!: string;

  /**
   * Total number of validators using the specified withdrawal credentials
   */
  @prop({ required: true })
  public count!: number;

  /**
   * Average amount staked by validators using the specified withdrawal credentials
   *
   * Stored in Gwei
   */
  @prop({ required: true })
  public avgStaked!: string;

  @prop({ required: true })
  public timestamp!: Date;
}
