// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface for the Ethereum Deposit Contract (EIP-6110 uses the existing deposit contract)
interface IDepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
}

contract BatchDeposit {
    // Address of the official Ethereum Deposit Contract (phase 0 deposit contract)
    // This contract is pre-deployed at a known address on mainnet.
    IDepositContract public constant depositContract =
        IDepositContract(0x00000000219ab540356cBB839Cbe05303d7705Fa);

    // Track seen validator pubkeys to detect top-ups vs new deposits.
    // We use the keccak256 hash of the 48-byte pubkey as the key for mapping (since pubkey is 48 bytes).
    mapping(bytes32 => bool) public seenPubkeys;

    // Event to log each deposit (indicate whether it's a top-up or new)
    event ValidatorDeposit(
        bytes indexed validatorPubkey,
        address indexed withdrawalAddress,
        uint256 amount,
        bool isTopUp
    );

    /// @notice Perform multiple deposits in a single transaction.
    /// @param pubkeys Array of BLS public keys for each validator (each 48 bytes).
    /// @param withdrawalCredentials Array of withdrawal credential bytes (each 32 bytes, typically starts with 0x01 for an ETH1 address).
    /// @param signatures Array of validator signatures for the deposit (each 96 bytes).
    /// @param depositDataRoots Array of the deposit data root for each deposit (32-byte commitment to deposit params, used for validation).
    /// @param amounts Array of deposit amounts in wei for each validator (must be between 1 ETH and 2048 ETH).
    /// Each index across the arrays corresponds to one deposit operation.
    function batchDeposit(
        bytes[] calldata pubkeys,
        bytes32[] calldata withdrawalCredentials,
        bytes[] calldata signatures,
        bytes32[] calldata depositDataRoots,
        uint256[] calldata amounts
    ) external payable {
        uint256 count = pubkeys.length;
        require(
            count == withdrawalCredentials.length &&
                count == signatures.length &&
                count == depositDataRoots.length &&
                count == amounts.length,
            "Input array lengths must match"
        );
        require(count > 0, "No deposits provided");

        // Gas optimization: accumulate total required ETH for all deposits.
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < count; ++i) {
            // Validate lengths of each parameter per deposit
            require(pubkeys[i].length == 48, "Invalid pubkey length");
            require(
                withdrawalCredentials[i].length == 32,
                "Invalid withdrawal cred length"
            );
            require(signatures[i].length == 96, "Invalid signature length");
            // Deposit amount constraints
            require(amounts[i] >= 1 ether, "Deposit value too low (min 1 ETH)");
            require(
                amounts[i] <= 2048 ether,
                "Deposit value too high (max 2048 ETH)"
            );
            require(
                amounts[i] % 1 gwei == 0,
                "Deposit value must be multiple of 1 gwei"
            );
            totalAmount += amounts[i];
        }
        require(
            totalAmount == msg.value,
            "Msg value must equal sum of deposit amounts"
        );

        // Process each deposit
        for (uint256 i = 0; i < count; ++i) {
            bytes32 pubkeyHash = keccak256(pubkeys[i]);
            bool isTopUp = seenPubkeys[pubkeyHash];
            // Mark this pubkey as seen (so future deposits will be treated as top-ups)
            seenPubkeys[pubkeyHash] = true;

            bytes memory withdrawal = abi.encodePacked(
                withdrawalCredentials[i]
            );

            // Call the Ethereum deposit contract for this entry.
            // This forwards the specified ETH (`amounts[i]`) and deposit data.
            depositContract.deposit{value: amounts[i]}(
                pubkeys[i],
                withdrawal,
                signatures[i],
                depositDataRoots[i]
            );
            // The deposit contract will validate the deposit data (including signature and deposit_data_root).
            // It emits a DepositEvent log if successful, and will revert the transaction on failure.

            // Emit an event for off-chain tracking (note: withdrawal address can be parsed from credentials if 0x01 type)
            address withdrawAddr = _getWithdrawalAddress(
                withdrawalCredentials[i]
            );
            emit ValidatorDeposit(
                pubkeys[i],
                withdrawAddr,
                amounts[i],
                isTopUp
            );
        }
        // All deposits done. Any failure in depositContract.deposit would have reverted the entire batch (ensuring atomicity).
    }

    /// @dev Internal helper to extract the withdrawal address (if credentials indicate an execution layer address).
    /// For 0x01 credentials, the last 20 bytes represent the ETH1 address. For 0x00 (BLS) credentials, this returns address(0).
    function _getWithdrawalAddress(
        bytes32 withdrawalCredential
    ) internal pure returns (address) {
        // Check if credential prefix indicates an ETH1 address (0x01)
        if (bytes1(withdrawalCredential) == 0x01) {
            // Last 20 bytes of the credential correspond to the ETH address
            // Shift the 32-byte value right by 12 bytes to obtain the lower 20 bytes as an address
            return address(uint160(uint256(withdrawalCredential)));
        }
        return address(0);
    }
}
