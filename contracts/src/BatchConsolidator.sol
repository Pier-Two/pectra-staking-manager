// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BatchConsolidator {
    address public owner;

    // The system contract for consolidation requests (EIP-7251).
    // Calls to this address with 96-byte data (sourcePubkey||targetPubkey) and an ETH fee will enqueue a consolidation request ([EIP-7251: Increase the MAX_EFFECTIVE_BALANCE](https://eips.ethereum.org/EIPS/eip-7251#:~:text=,invoke%20system%20operation%20on%20contract)).
    address public constant CONSOLIDATION_CONTRACT =
        0x0000BBdDc7CE488642fb579F8B00f3a590007251;

    // Event to log each consolidation request submitted
    event ConsolidationRequested(
        bytes indexed sourceValidator,
        bytes indexed targetValidator
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// @notice Batch consolidate multiple validators into a target validator.
    /// @param targetPubkey The BLS public key of the target validator (48 bytes).
    /// @param sourcePubkeys Array of BLS public keys of source validators to consolidate into the target (each 48 bytes).
    /// The caller must be the owner (withdrawal address holder) for these validators.
    function batchConsolidate(
        bytes calldata targetPubkey,
        bytes[] calldata sourcePubkeys
    ) external payable onlyOwner {
        require(targetPubkey.length == 48, "Invalid target pubkey length");
        require(sourcePubkeys.length > 0, "No source validators provided");

        uint256 totalFeeConsumed = 0;
        uint256 numSources = sourcePubkeys.length;

        for (uint256 i = 0; i < numSources; ++i) {
            require(
                sourcePubkeys[i].length == 48,
                "Invalid source pubkey length"
            );
            // Prepare the consolidation request call data: [source_pubkey || target_pubkey]
            bytes memory requestData = abi.encodePacked(
                sourcePubkeys[i],
                targetPubkey
            );
            // The combined pubkeys must form 96 bytes of data for the system contract call
            require(
                requestData.length == 96,
                "Incorrect concatenated pubkey length"
            );

            // Query the current consolidation fee (calling with empty data returns the fee ([EIP-7251: Increase the MAX_EFFECTIVE_BALANCE](https://eips.ethereum.org/EIPS/eip-7251#:~:text=1.%20Add%20consolidation%20request%20,current%20block%20from%20the%20queue))).
            (bool feeSuccess, bytes memory feeResult) = CONSOLIDATION_CONTRACT
                .staticcall("");
            require(
                feeSuccess && feeResult.length == 32,
                "Failed to get consolidation fee"
            );
            uint256 currentFee = abi.decode(feeResult, (uint256));

            // Ensure we have enough ETH left in this transaction to pay the fee
            require(
                address(this).balance >= currentFee,
                "Insufficient ETH for consolidation fee"
            );

            // Call the consolidation contract with the required fee to enqueue the request
            (bool success, ) = CONSOLIDATION_CONTRACT.call{value: currentFee}(
                requestData
            );
            require(success, "Consolidation request failed");

            totalFeeConsumed += currentFee;
            emit ConsolidationRequested(sourcePubkeys[i], targetPubkey);
            // Note: We cast the 48-byte values to `bytes48` in the event for clarity, though they remain the same 48-byte data.
        }

        // Refund any excess ETH back to the owner (caller). This handles the case where the provided msg.value was slightly higher than needed.
        uint256 remaining = address(this).balance;
        if (remaining > 0) {
            (bool sent, ) = payable(msg.sender).call{value: remaining}("");
            require(sent, "Refund transfer failed");
        }
    }

    /// @dev Utility to convert dynamic bytes (expected length 48) to a fixed-size 48-byte array for type-casting.
    function _toBytes48(bytes memory b) internal pure returns (bytes32 result) {
        require(b.length == 48, "Bytes length is not 48");
        // Copy first 32 bytes
        assembly {
            result := mload(add(b, 32))
        }
        // Note: We ignore the remaining 16 bytes in this helper (since bytes32 can only hold 32).
        // This is just to facilitate logging; the event still logs the full 48 bytes via indexed topic.
    }

    /// @notice Withdraw any ETH held by the contract to the owner.
    /// @dev This can send back leftover funds or any funds sent accidentally to this contract.
    function withdrawExcessETH(uint256 amount) external onlyOwner {
        (bool sent, ) = payable(owner).call{value: amount}("");
        require(sent, "Withdraw transfer failed");
    }

    // Allow the contract to receive ETH.
    // Consolidation fees are paid from msg.value which the contract holds during execution.
    receive() external payable {}
}
