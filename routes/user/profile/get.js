const { findOneAndSelect, getAggregate, findOne } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getProfile = async (req, res) => {
	try {
		const _id = req.params.id;
		// let user = await findOneAndSelect(
		// 	"user",
		// 	{
		// 		_id
		// 	},
		// 	"-followers -following"
		// );


		// let user = await getAggregate("user", [
		// 	{
		// 		$match: {
		// 			_id: ObjectID(_id)
		// 		}
		// 	},
		// 	{
		// 		$addFields: {
		// 			lengthOfFollowers: {
		// 				$size: "$followers"
		// 			},
		// 			lengthOfFollowing: {
		// 				$size: "$following"
		// 			}
		// 		}
		// 	},
		// 	{
		// 		$project: {
		// 			following: 0,
		// 			followers: 0
		// 		}
		// 	}
		// ]);
		// if (!user[0]) {
		// 	return res.status(404).send({ status: 404, message: "No User Found" });
		// }

const singleUser = await findOne('user',{ _id })
if(!singleUser){
	return res.status(404).send({ status: 404, message: "No User Found" });
}

		let userSell = await getAggregate("multipleUser", [
			{
				$match: {
					ownerId: ObjectID(_id)
				}
			},
			{
				$project: {
				  convertedNumber: { $toDouble: "$price" }
				}
			  },
			{
             $group: {
				_id: "$ownerId",
				sumValue: { $sum: "$convertedNumber" },
				//  sumValue : {$sum: "$price"},
				  toalCount:{$sum: 1}

			 }
			 },
			
			
		
		]);

		console.log(userSell,"sell");

		
		return res.status(200).send({ status: 200, singleUser, nbdhit:userSell.length, userSell });
		
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};

module.exports = getProfile;
