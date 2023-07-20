const boom = require("@hapi/boom");
const Follow = require("../models/follow.model");
const User = require('../models/user.model')

class followService {
    async create(data) {
        const { user1Id, user2Id } = data;
        const relation = await Follow.findOne({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        if (relation) {
            throw boom.conflict("Existing relationship");
        }
        const follow = Follow(data);
        const newFollow = await follow.save();
        return newFollow;
    }

    async delete(user1Id, user2Id) {
        const relation = await Follow.findOne({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        if (!relation) {
            throw boom.notFound("relation not found");
        }
        await Follow.findOneAndRemove({$or: [{ user1Id, user2Id }, {user1Id: user2Id, user2Id: user1Id}]});
        return { user1Id, user2Id };
    }

    

    async getFriendRecommendations(userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw boom.notFound("User not found");
      }
      const userFollowings = await Follow.find({ user1Id: userId });
    
     
      const userFollowingsIds = userFollowings.map(following => following.user2Id);
      
      console.log(userFollowingsIds)

      return userFollowingsIds
    }

    async getFriendRecommendationsV2(userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw boom.notFound("User not found");
      }
      const userFollowings = await Follow.find({ user1Id: userId });
      const userFollowingsIds = userFollowings.map(following => following.user2Id);
      console.log(userFollowingsIds)
      const followPromises = userFollowingsIds.map(async (id) => {
        const follows = await Follow.find({ user1Id: id });
        return { userId: id, follows };
      });
      console.log(followPromises)
      const followResults = await Promise.all(followPromises);
      console.log(followResults)
      return followResults;
    }

    async getFriendRecommendationsV3(userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw boom.notFound("User not found");
      }
      const userFollowings = await Follow.find({ user1Id: userId });
      const userFollowingsIds = userFollowings.map(following => following.user2Id);
      console.log(userFollowingsIds)
      const followPromises = userFollowingsIds.map(async (id) => {
        const follows = await Follow.find({ user1Id: id });
        return { userId: id, follows };
      });
      console.log(followPromises)
      const followResults = await Promise.all(followPromises);
      console.log(followResults)
    
      const follows = followResults.map(result => result.follows);
      console.log(follows);
    
      return follows;
    }
    
    
    // async getFriendRecommendationsV4(userId) {
    //   const user = await User.findById(userId);
    //   if (!user) {
    //     throw boom.notFound("User not found");
    //   }
    //   const userFollowings = await Follow.find({ user1Id: userId });
    //   const userFollowingsIds = userFollowings.map(following => following.user2Id);
    //   // console.log('////////////////------///////////////////////')
    //   // console.log(userFollowingsIds)
    //   // console.log('////////////////------///////////////////////')
    //   const followPromises = userFollowingsIds.map(async (id) => {
    //     const follows = await Follow.find({ user1Id: id });
    //     return { userId: id, follows };
    //   });
     
    //   const followResults = await Promise.all(followPromises);
    //   console.log('////////////////------///////////////////////')
    //   console.log(followResults)
    //   console.log('////////////////------///////////////////////')
    //   //
    //   const uniqueFollowUser2Ids = Array.from(new Set(followResults.flatMap(result => result.follows.map(f => f.user2Id))));
    
    //   const follows = uniqueFollowUser2Ids.filter(id => !userFollowingsIds.includes(id) && id !== userId);
    //   // console.log('////////////////------///////////////////////')
    //   // console.log(follows);
    //   // console.log('////////////////------///////////////////////')
    //   const recommendationsWithNames = await Promise.all(follows.map(async (id) => {
    //     const user = await User.findById(id);
    //     return { userId: id, name: user ? user.name : "Unknown" };
    //   }));
    //   // console.log('////////////////------///////////////////////')
    //   // console.log(recommendationsWithNames)
    //   // console.log('////////////////------///////////////////////')
    //   return recommendationsWithNames;
    // }

    async getFriendRecommendationsV4(userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw boom.notFound("User not found");
      }

      const userFollowings = await Follow.find({ user1Id: userId });
      const userFollowingsIds = userFollowings.map(following => following.user2Id);

      const followPromises = userFollowingsIds.map(async (id) => {
        const follows = await Follow.find({ user1Id: id });
        const followIds = follows.map(follow => follow.user2Id); // Extract the user2Id from each follow
        return followIds;
      });
    
      const followResults = await Promise.all(followPromises);

      const uniqueFollowUser2Ids = Array.from(new Set(followResults.flat())); // Flatten the arrays and make them unique
      const follows = uniqueFollowUser2Ids.filter(id => id !== userId);

      const recommendationsWithNames = await Promise.all(follows.map(async (id) => {
        const user = await User.findById(id);
        return { userId: id, name: user ? user.name : "Unknown" };
      }));

      return recommendationsWithNames.slice(1);
      
    }
    
    
    
}

module.exports = followService;