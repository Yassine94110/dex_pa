// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/extensions/IAccessControlEnumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



contract RoleManager is AccessControl {
    
   bytes32 public constant ROLE_USER = keccak256("user");
   bytes32 public constant ROLE_ADMIN = keccak256("admin");
   bytes32 public constant ROLE_BANNED = keccak256("banned");

 
    



        constructor() {
        _grantRole(ROLE_ADMIN, msg.sender);
        _grantRole(ROLE_USER, msg.sender);
        }

        function register() public hasNoRole {
         _grantRole(ROLE_USER, msg.sender);
        }

        function ban(address _bannedUser) public onlyRole(ROLE_ADMIN){
           renounceRole(ROLE_USER,_bannedUser);
           _grantRole(ROLE_BANNED, _bannedUser);
        }
           function unban(address _bannedUser) public onlyRole(ROLE_ADMIN){
           renounceRole(ROLE_BANNED,_bannedUser);
           _grantRole(ROLE_USER,_bannedUser);
        }
        function grantAdmin(address _address) external onlyRole(ROLE_ADMIN){
         _grantRole(ROLE_ADMIN, _address);
        }

      function isUser() public view returns (bool) {
        return hasRole(ROLE_USER, msg.sender);
     }
 
          modifier hasNoRole() {
       !hasRole(ROLE_USER, msg.sender) && !hasRole(ROLE_ADMIN, msg.sender);
        _;
    }

}