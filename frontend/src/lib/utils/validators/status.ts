import {
  type ValidatorDetails,
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
    case "active_slashed":
    case "withdrawal_possible":
    case "withdrawal_done":
      return ValidatorStatus.ACTIVE;

    case "active_exiting":
    case "exited_unslashed":
    case "exited_slashed":
    case "exited":
      return ValidatorStatus.EXITED;

    case "active_offline":
      return ValidatorStatus.INACTIVE;

    default:
      return ValidatorStatus.INACTIVE;
  }
};

export const validatorIsActive = (validator: ValidatorDetails): boolean => {
  return (
    validator.status === ValidatorStatus.ACTIVE && !validator.pendingUpgrade
  );
};

export const validatorIsInactive = (validator: ValidatorDetails): boolean => {
  return validator.status === ValidatorStatus.INACTIVE;
};

export const validatorIsExited = (validator: ValidatorDetails): boolean => {
  return validator.status === ValidatorStatus.EXITED;
};
