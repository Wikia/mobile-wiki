/* eslint-disable quote-props, quotes, max-len */
const activities = {
	"days": 30,
	"users": [
		{
			"actions": 60,
			"breakdown": {
				"queued": 20,
				"verified": 20,
				"deleted": 20
			},
			"userId": 23914359,
			"userInfo": {
				"id": "23914359",
				"avatarUrl": "http:\/\/dev-vignette.wikia-dev.com\/043b4107-8029-42c4-aae8-6c2489c3be5f\/scale-to-width-down\/100",
				"name": "ModUser1ModUser1ModUser1ModUser1ModUser1ModUser1ModUser1",
				"badgePermission": "badge:threadmoderator"
			},
			"rank": 1
		},
		{
			"actions": 150,
			"breakdown": {
				"queued": 120,
				"verified": 20,
				"deleted": 10
			},
			"userId": 23914359,
			"userInfo": {
				"id": "23914359",
				"avatarUrl": "http:\/\/dev-vignette.wikia-dev.com\/043b4107-8029-42c4-aae8-6c2489c3be5f\/scale-to-width-down\/100",
				"name": "ModUser2ModUser2ModUser2ModUser2",
				"badgePermission": "badge:threadmoderator"
			},
			"rank": 2
		},
		{
			"actions": 40,
			"breakdown": {
				"queued": 10,
				"verified": 20,
				"deleted": 10
			},
			"userId": 23914359,
			"userInfo": {
				"id": "23914359",
				"avatarUrl": "http:\/\/dev-vignette.wikia-dev.com\/043b4107-8029-42c4-aae8-6c2489c3be5f\/scale-to-width-down\/100",
				"name": "ModUser3",
				"badgePermission": "badge:threadmoderator"
			},
			"rank": 3
		}
	]
};

let activityUsers = activities.users;
for (let i = 0; i < 16; i++) {
	activities.users = activities.users.concat(activityUsers);
}

export default activities;
