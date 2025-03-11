// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BatchWithdrawal {
    address public owner;

    // The system contract for withdrawal/exit requests (EIP-7002).
    // Calls to this address with 56-byte data (pubkey||amount) and a fee enqueue a withdrawal/exit request ([EIP-7002: Execution layer triggerable withdrawals](https://eips.ethereum.org/EIPS/eip-7002#:~:text=Name%20Value%20Comment%20,0)).
    address public constant WITHDRAWAL_CONTRACT =
        0x00000961Ef480Eb55e80D19ad83579A64c007002;

    // Event to log each withdrawal or exit request
    event WithdrawalRequested(bytes indexed validatorPubkey, uint64 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// @notice Trigger withdrawals or exits for multiple validators in one transaction.
    /// @param validatorPubkeys Array of validator BLS public keys (each 48 bytes) to withdraw from.
    /// @param amounts Array of amounts (in wei) to withdraw for each validator. Use 0 to indicate a full exit.
    /// The caller must be the owner (the address holding the withdrawal credentials for these validators).
    function batchWithdraw(
        bytes[] calldata validatorPubkeys,
        uint64[] calldata amounts
    ) external payable onlyOwner {
        uint256 n = validatorPubkeys.length;
        require(n == amounts.length, "Input array lengths must match");
        require(n > 0, "No withdrawal requests provided");

        for (uint256 i = 0; i < n; ++i) {
            require(validatorPubkeys[i].length == 48, "Invalid pubkey length");

            // Prepare the 56-byte withdrawal request: [validator_pubkey (48 bytes) || amount (8 bytes)]
            // Amount is a uint64 in big-endian format per EIP-7002 spec.
            bytes memory requestData = abi.encodePacked(
                validatorPubkeys[i],
                _toBytes8(amounts[i])
            );
            require(requestData.length == 56, "Invalid request data length");

            // Query the current withdrawal request fee (no input returns the fee ([EIP-7002: Execution layer triggerable withdrawals](https://eips.ethereum.org/EIPS/eip-7002#:~:text=1.%20Add%20withdrawal%20request%20,current%20block%20from%20the%20queue))).
            (bool feeSuccess, bytes memory feeResult) = WITHDRAWAL_CONTRACT
                .staticcall("");
            require(
                feeSuccess && feeResult.length == 32,
                "Failed to get withdrawal fee"
            );
            uint256 fee = abi.decode(feeResult, (uint256));

            require(
                address(this).balance >= fee,
                "Insufficient ETH for withdrawal request fee"
            );

            // Call the withdrawal request contract with the fee to enqueue the request
            (bool success, ) = WITHDRAWAL_CONTRACT.call{value: fee}(
                requestData
            );
            require(success, "Withdrawal request failed");

            emit WithdrawalRequested(validatorPubkeys[i], amounts[i]);
            // If amount == 0 in the event, it indicates a full exit request for that validator.
        }

        // Refund any leftover ETH (from fees) to the caller.
        uint256 remaining = address(this).balance;
        if (remaining > 0) {
            (bool sent, ) = payable(msg.sender).call{value: remaining}("");
            require(sent, "Refund transfer failed");
        }
    }

    /// @dev Helper to convert a uint64 to 8-byte big-endian representation.
    function _toBytes8(uint64 x) internal pure returns (bytes8) {
        return bytes8(x);
    }

    /// @dev Helper to convert dynamic bytes (length 48 expected) to bytes32 (first 32 bytes) for logging purposes.
    function _toBytes48(bytes memory b) internal pure returns (bytes32 result) {
        require(b.length == 48, "Bytes length is not 48");
        assembly {
            result := mload(add(b, 32))
        }
    }

    /// @notice Withdraw any excess ETH from the contract to the owner.
    /// @dev In case any ETH gets stuck in the contract (for example, if withdrawal payouts are sent to this contract address),
    /// the owner can retrieve them using this function.
    function withdrawExcessETH(uint256 amount) external onlyOwner {
        (bool sent, ) = payable(owner).call{value: amount}("");
        require(sent, "Withdraw transfer failed");
    }

    // Allow contract to receive ETH (e.g., to hold fees temporarily or receive withdrawal payouts).
    receive() external payable {}
}
