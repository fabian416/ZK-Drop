// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZKL {
    function mint(address to, uint256 amount) external;
}

contract PreSale {
    IERC20 public immutable USDT;
    IZKL public immutable ZKL;

    uint256 public constant TOKEN_PRICE_USDT = 50; // 0.50 USDT → considering 2 decimals
    uint256 public constant USDT_DECIMALS = 6;
    uint256 public constant ZKL_DECIMALS = 6;

    event TokensBought(address indexed buyer, uint256 usdtSpent, uint256 tokensMinted);

    constructor(address _usdt, address _zkl) {
        USDT = IERC20(_usdt);
        ZKL = IZKL(_zkl);
    }

    function buyWithUsdt(uint256 usdtAmount) external {
        require(usdtAmount > 0, "Invalid USDT amount");

        // Transfer USDT from buyer to this contract
        require(
            USDT.transferFrom(msg.sender, address(this), usdtAmount),
            "USDT transfer failed"
        );

        // Calculate how many tokens (price = 0.50 USDT)
        // usdtAmount using 6 decimals
        // 1 ZKL = 0.50 USDT → 50 / 100

        // Multiply by 10^6 para keep precision
        uint256 tokensToMint = (usdtAmount * 10**ZKL_DECIMALS) / TOKEN_PRICE_USDT * 2;

        ZKL.mint(msg.sender, tokensToMint);

        emit TokensBought(msg.sender, usdtAmount, tokensToMint);
    }
}