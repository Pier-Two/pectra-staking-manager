// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

interface IBatchDeposit {
    struct Deposit {
        bytes pubKey;
        bytes withdrawalCredentials;
        bytes signature;
        uint256 amount;
    }

    error NoDepositsProvided();

    error InvalidPubKeyLength();

    error InvalidWithdrawalCredLength();

    error InvalidSignatureLength();

    // TODO: IS this correct??
    error DepositValueLessThan1ETH();

    error DepositValueGreaterThan2048ETH();

    // TODO: IS this correct??
    error DepositValueMustBeMultipleOfGwei();

    error MsgValueNotEqualToTotalDepositAmount();
}
