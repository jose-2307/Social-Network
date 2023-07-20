const boom = require("@hapi/boom");
const Follow = require("../models/follow.model");
const User = require('../models/user.model');
const UserService = require("./user.service");

const userService = new UserService();

class followService {
    async create(data) {
        const { user1Id, user2Id } = data;
        if (user1Id === user2Id){
          throw boom.conflict("Same users");
        }
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

    

    async getFriends(userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw boom.notFound("User not found");
      }
      const userFollowings = await Follow.find({$or: [{ user1Id :  userId}, {user2Id: userId}]});
      const ids = [];
      userFollowings.forEach(x => {
        if (x._doc.user1Id != userId) ids.push(x._doc.user1Id);
        if (x._doc.user2Id != userId) ids.push(x._doc.user2Id);
      })
      const resp = [];
      for (let x of ids) {
        const user = await userService.findOne(x);
        resp.push(user);
      }
      return resp;
    }
    

    async getFriendRecommendationsV4(userId) {
      const user = await User.findById(userId);
        if (!user) {
          throw boom.notFound("User not found");
        }

        const userFollowings = await Follow.find({ user1Id: userId });
        const userFollowingsIds = userFollowings.map(following => following.user2Id);

        const followPromises = userFollowingsIds.map(async (id) => {
          const follows = await Follow.find({ user1Id: id });
          const followIds = follows.map(follow => follow.user2Id);
          return followIds;
        });

        const followResults = await Promise.all(followPromises);

        const uniqueFollowUser2Ids = Array.from(new Set(followResults.flat()));
        const follows = uniqueFollowUser2Ids.filter(id => id !== userId);

        const FollowRecomended = [];

        for (let x of follows) {
          const friend = await Follow.findOne({$or: [{ user1Id : x._id, user2Id : userId}, {user1Id: userId, user2Id: x._id}]});
          if (!friend) {
            FollowRecomended.push(x);
          }
        }

        const UniqueRecomendations = [];

        for (let x of FollowRecomended) {
          const repetido = userFollowings.includes(x);
          if (!repetido) {
            UniqueRecomendations.push(x);
          }
        }

        const recommendationsWithNames = [];

        for (let userId of UniqueRecomendations) {
          const user = await User.findById(userId);
          if (user) {
            const recommendation = {
              id: userId,
              name: user.name // Assuming 'name' is the property that stores the user's name in the User model/schema
            };
            recommendationsWithNames.push(recommendation);
          }
        }

        return recommendationsWithNames;
    }
    
    
    
}

module.exports = followService;