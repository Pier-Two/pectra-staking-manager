import {
  type ValidatorLifecycleStatus,
  ValidatorStatus,
} from "pec/types/validator";

export const getValidatorStatus = (
  status: ValidatorLifecycleStatus,
): ValidatorStatus => {
  switch (status) {
    case "pending_initialized":
    case "pending_queued":
      return ValidatorStatus.PENDING;

    case "active_ongoing":
    case "active_online":
    case "active_offline":
    case "active_slashed":
    case "withdrawal_possible":
    case "withdrawal_done":
      return ValidatorStatus.ACTIVE;

    case "active_exiting":
    case "exited_unslashed":
    case "exited_slashed":
    case "exited":
      return ValidatorStatus.EXITED;

    default:
      return ValidatorStatus.INACTIVE;
  }
};
