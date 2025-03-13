// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libs/DepositDataRoot.sol";
import "../interfaces/IBatchDeposit.sol";

// Interface for the Ethereum Deposit Contract (EIP-6110 uses the existing deposit contract)
interface IDepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
}

contract BatchDeposit is IBatchDeposit {
    using DepositDataRoot for Deposit;

    // Address of the official Ethereum Deposit Contract (phase 0 deposit contract)
    // This contract is pre-deployed at a known address on mainnet.
    IDepositContract public constant depositContract =
        IDepositContract(0x00000000219ab540356cBB839Cbe05303d7705Fa);

    // Event to log each deposit (indicate whether it's a top-up or new)
    // event ValidatorDeposit(
    //     bytes indexed validatorPubkey,
    //     address indexed withdrawalAddress,
    //     uint256 amount,
    //     bool isTopUp
    // );

    /// @notice Perform multiple deposits in a single transaction.
    /// @param _deposits An array of Deposit structs, each containing the data required to make a deposit.
    function batchDeposit(Deposit[] calldata _deposits) external payable {
        if (_deposits.length == 0) {
            revert NoDepositsProvided();
        }

        // Gas optimization: accumulate total required ETH for all deposits.
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _deposits.length; ++i) {
            if (_deposits[i].pubkey.length != 48) {
                revert InvalidPubkeyLength();
            }
            if (_deposits[i].withdrawalCredentials.length != 32) {
                revert InvalidWithdrawalCredLength();
            }
            if (_deposits[i].signature.length != 96) {
                revert InvalidSignatureLength();
            }
            if (_deposits[i].amount < 1 ether) {
                revert DepositValueLessThan1ETH();
            }
            if (_deposits[i].amount > 2048 ether) {
                revert DepositValueGreaterThan2048ETH();
            }
            if (_deposits[i].amount % 1 gwei != 0) {
                revert DepositValueMustBeMultipleOfGwei();
            }

            totalAmount += _deposits[i].amount;
        }
        if (totalAmount != msg.value) {
            revert MsgValueNotEqualToTotalDepositAmount();
        }

        // Process each deposit
        for (uint256 i = 0; i < _deposits.length; ++i) {
            bytes32 depositDataRoot = _deposits[i].formatDepositDataRoot();

            // Call the Ethereum deposit contract for this entry.
            depositContract.deposit{value: _deposits[i].amount}(
                _deposits[i].pubkey,
                _deposits[i].withdrawalCredentials,
                _deposits[i].signature,
                depositDataRoot
            );
        }
    }
}
