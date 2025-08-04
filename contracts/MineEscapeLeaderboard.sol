// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MineEscapeLeaderboard {
    struct Score {
        address player;
        uint256 score;
        uint256 gems;
        uint256 timestamp;
    }
    
    Score[] public leaderboard;
    mapping(address => uint256) public playerBestScore;
    
    event ScoreSubmitted(address indexed player, uint256 score, uint256 gems);
    
    function submitScore(uint256 _score, uint256 _gems) external {
        require(_score > 0, "Score must be greater than 0");
        require(_gems > 0, "Must have collected at least 1 gem");
        
        // Only update if this is a better score
        if (_score > playerBestScore[msg.sender]) {
            playerBestScore[msg.sender] = _score;
            
            Score memory newScore = Score({
                player: msg.sender,
                score: _score,
                gems: _gems,
                timestamp: block.timestamp
            });
            
            // Insert score in correct position (sorted by score descending)
            uint256 insertIndex = leaderboard.length;
            for (uint256 i = 0; i < leaderboard.length; i++) {
                if (_score > leaderboard[i].score) {
                    insertIndex = i;
                    break;
                }
            }
            
            // Insert at the correct position
            leaderboard.push(newScore);
            for (uint256 i = leaderboard.length - 1; i > insertIndex; i--) {
                leaderboard[i] = leaderboard[i - 1];
            }
            leaderboard[insertIndex] = newScore;
            
            // Keep only top 100 scores
            if (leaderboard.length > 100) {
                leaderboard.pop();
            }
            
            emit ScoreSubmitted(msg.sender, _score, _gems);
        }
    }
    
    function getTopScores(uint256 _count) external view returns (Score[] memory) {
        uint256 count = _count > leaderboard.length ? leaderboard.length : _count;
        Score[] memory topScores = new Score[](count);
        
        for (uint256 i = 0; i < count; i++) {
            topScores[i] = leaderboard[i];
        }
        
        return topScores;
    }
    
    function getLeaderboardLength() external view returns (uint256) {
        return leaderboard.length;
    }
    
    function getPlayerRank(address _player) external view returns (uint256) {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].player == _player) {
                return i + 1; // Rank starts from 1
            }
        }
        return 0; // Player not found
    }
}