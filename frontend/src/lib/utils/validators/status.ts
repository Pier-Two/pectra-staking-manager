import {
  type ValidatorDetails,
  type ValidatorLifecycleStatus,
  ValidatorStatus,
} from "pec/types/validator";

export const getValidatorStatus = (
  status: ValidatorLifecycleStatus,
): ValidatorStatus => {
  // Helpful catch-all here
  // Our zod schema accepts a string (incase beaconchain changes their response type). This helps mitigate potential changes
  if (status.includes("exit")) return ValidatorStatus.EXITED;

  switch (status) {
    case "pending_initialized":
    case "pending_queued":
      return ValidatorStatus.PENDING;

    case "active_ongoing":
    case "active_online":
    case "active_slashed":
    case "withdrawal_possible":
    case "active_offline":
    case "withdrawal_done":
      return ValidatorStatus.ACTIVE;

    case "active_exiting":
    case "exited_unslashed":
    case "exited_slashed":
    case "exiting_online":
    case "exited":
      return ValidatorStatus.EXITED;

    default:
      return ValidatorStatus.ACTIVE;
  }
};

export const validatorIsActive = (validator: ValidatorDetails): boolean => {
  return (
    validator.status === ValidatorStatus.ACTIVE && !validator.pendingUpgrade
  );
};

export const validatorIsExited = (validator: ValidatorDetails): boolean => {
  return validator.status === ValidatorStatus.EXITED;
};
