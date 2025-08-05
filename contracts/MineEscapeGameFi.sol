// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MineEscapeGameFi is ERC721, Ownable {
    IERC20 public sttToken;
    
    struct GameSession {
        uint256 currentLevel;
        uint256 gemsCollected;
        bool isActive;
        uint256 totalTokensSpent;
    }
    
    struct LeaderboardEntry {
        address player;
        uint256 maxLevel;
        uint256 totalGems;
        uint256 timestamp;
    }
    
    mapping(address => GameSession) public gameSessions;
    mapping(address => bool) public hasCompletionBadge;
    LeaderboardEntry[] public leaderboard;
    
    uint256[] public levelEntryCosts = [1e17, 2e17, 3e17, 4e17, 5e17]; // 0.1-0.5 STT
    uint256 public constant GEMS_TO_TOKEN_RATE = 10; // 10 gems = 1 STT
    uint256 public constant MAX_LEVELS = 5;
    uint256 private badgeTokenId = 1;
    
    event GameStarted(address indexed player, uint256 level);
    event LevelCompleted(address indexed player, uint256 level, uint256 gems);
    event GameFailed(address indexed player, uint256 level);
    event GemsConverted(address indexed player, uint256 gems, uint256 tokens);
    event BadgeMinted(address indexed player, uint256 tokenId);
    
    constructor(address _sttToken) ERC721("MineEscape Badge", "MEB") {
        sttToken = IERC20(_sttToken);
    }
    
    function startLevel(uint256 level) external {
        require(level >= 1 && level <= MAX_LEVELS, "Invalid level");
        require(level == 1 || gameSessions[msg.sender].currentLevel == level - 1, "Must progress sequentially");
        require(sttToken.balanceOf(msg.sender) >= levelEntryCosts[level - 1], "Insufficient STT balance");
        
        sttToken.transferFrom(msg.sender, address(this), levelEntryCosts[level - 1]);
        
        if (level == 1) {
            gameSessions[msg.sender] = GameSession(1, 0, true, levelEntryCosts[0]);
        } else {
            gameSessions[msg.sender].currentLevel = level;
            gameSessions[msg.sender].totalTokensSpent += levelEntryCosts[level - 1];
        }
        
        emit GameStarted(msg.sender, level);
    }
    
    function completeLevel(uint256 gems) external {
        GameSession storage session = gameSessions[msg.sender];
        require(session.isActive, "No active game session");
        
        session.gemsCollected += gems;
        
        if (session.currentLevel == MAX_LEVELS) {
            // Game completed - mint badge
            if (!hasCompletionBadge[msg.sender]) {
                _mint(msg.sender, badgeTokenId);
                hasCompletionBadge[msg.sender] = true;
                emit BadgeMinted(msg.sender, badgeTokenId);
                badgeTokenId++;
            }
            
            // Convert gems to tokens
            uint256 tokenReward = session.gemsCollected / GEMS_TO_TOKEN_RATE * 1e18;
            if (tokenReward > 0) {
                sttToken.transfer(msg.sender, tokenReward);
                emit GemsConverted(msg.sender, session.gemsCollected, tokenReward);
            }
            
            updateLeaderboard(msg.sender, session.currentLevel, session.gemsCollected);
            delete gameSessions[msg.sender];
        }
        
        emit LevelCompleted(msg.sender, session.currentLevel, gems);
    }
    
    function failGame() external {
        GameSession storage session = gameSessions[msg.sender];
        require(session.isActive, "No active game session");
        
        emit GameFailed(msg.sender, session.currentLevel);
        delete gameSessions[msg.sender];
    }
    
    function exitGame() external {
        GameSession storage session = gameSessions[msg.sender];
        require(session.isActive, "No active game session");
        
        // Convert gems to tokens
        uint256 tokenReward = session.gemsCollected / GEMS_TO_TOKEN_RATE * 1e18;
        if (tokenReward > 0) {
            sttToken.transfer(msg.sender, tokenReward);
            emit GemsConverted(msg.sender, session.gemsCollected, tokenReward);
        }
        
        updateLeaderboard(msg.sender, session.currentLevel, session.gemsCollected);
        delete gameSessions[msg.sender];
    }
    
    function updateLeaderboard(address player, uint256 level, uint256 gems) internal {
        // Simple leaderboard - keep top 100
        leaderboard.push(LeaderboardEntry(player, level, gems, block.timestamp));
        
        // Sort by level then gems (simplified)
        if (leaderboard.length > 100) {
            // Remove lowest entry (simplified)
            leaderboard.pop();
        }
    }
    
    function getGameSession(address player) external view returns (GameSession memory) {
        return gameSessions[player];
    }
    
    function getLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return leaderboard;
    }
    
    function getLevelCost(uint256 level) external view returns (uint256) {
        require(level >= 1 && level <= MAX_LEVELS, "Invalid level");
        return levelEntryCosts[level - 1];
    }
}