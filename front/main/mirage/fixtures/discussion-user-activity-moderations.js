/* eslint-disable quote-props, quotes, max-len */
const activities = {
	"days": 30,
	"users": [
		{
			"actions": 1234,
			"breakdown": {
				"delete": 20,
				"undelete": 20,
				"validation": 20,
				"move": 4,
				"update": 0,
				"create": 0,
				"reorder": 0
			},
			"userId": 23914359,
			"userInfo": {
				"id": "23914359",
				"avatarUrl": "http:\/\/dev-vignette.wikia-dev.com\/043b4107-8029-42c4-aae8-6c2489c3be5f\/scale-to-width-down\/100",
				"name": "ModUser1",
				"badgePermission": "badge:threadmoderator"
			},
			"rank": 1
		},
		{
			"actions": 64,
			"breakdown": {
				"delete": 10,
				"undelete": 20,
				"validation": 20,
				"move": 0,
				"update": 0,
				"create": 0,
				"reorder": 0
			},
			"userId": 23912429,
			"userInfo": {
				"id": "23912429",
				"avatarUrl": "http:\/\/dev-vignette.wikia-dev.com\/c243bebe-3636-4715-beea-134bf365708d\/scale-to-width-down\/100",
				"name": "ModUser2",
				"badgePermission": "badge:staff"
			},
			"rank": 2
		},
		{
			"actions": 26,
			"breakdown": {
				"delete": 20,
				"undelete": 2,
				"validation": 2,
				"move": 2,
				"update": 0,
				"create": 0,
				"reorder": 0
			},
			"userId": 24026967,
			"userInfo": {
				"id": "24026967",
				"avatarUrl": null,
				"name": "ModUser3",
				"badgePermission": null
			},
			"rank": 3
		},
	]
};

let activityUsers = activities.users;
for (let i = 0; i < 16; i++) {
	activities.users = activities.users.concat(activityUsers);
}
export default activities;
