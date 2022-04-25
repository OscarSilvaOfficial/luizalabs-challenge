export interface PersonPayload {
  name: string;
  friends: string[];
}

export interface PersonPayloadResponse {
  name: string;
  friends: string[];
}

export interface PersonFriendsPayloadResponse {
  name: string;
  friendsOfFriends: string[];
}
