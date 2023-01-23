import { GET_FOLLOWER_FOLLOWING_LIST } from "./follower.type";

const initialState = {
  followersFollowing: [],
};

const followerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOWER_FOLLOWING_LIST:
      return {
        ...state,
        followersFollowing: action.payload,
      };

    default:
      return state;
  }
};

export default followerReducer;
