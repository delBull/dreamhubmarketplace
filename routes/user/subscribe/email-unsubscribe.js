// const subscribe = require("../../../models/subscribe/index");
// const  findOne  = require("../../../helpers/index");
//  const deleteOne  = require("../../../helpers/index");


const { deleteDocument } = require("../../../helpers/index");
const Joi = require("joi");
const saveActivity = require('../../../middleware/activity/save-activity');

const schema = Joi.object({
  email: Joi.string().email().required(),
});


const emailUnsubscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const validate = await schema.validateAsync(req.body);
    const deleteQuery = { email };
    let response = await deleteDocument("subscribe", deleteQuery);
   saveActivity(req, res,  `User ${email} unsbscribe email successfully`);
    return res.status(200).send({ status: 200, response });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = emailUnsubscribe;


























// const email_Unsubscribe = async (req, res) => {
//   try {
//     const { email } = req.params.email;
//     //if (req.params.email !== "undefined") {
//       // When we unsubscribe, check for an email
      
//       const findemail = await findOne("subscribe", { email});

//       if (findemail) {
//         // If it exists, remove it
//         const findemail = await deleteDocument("subscribe", { email });
//         // if (delete) {
//         //   return res
//         //     .status(400)
//         //     .json({ status: 400, message: "user not found" });
//         // }
//         return res.status(200).send({ status: 200, message: "Email deleted." });
//       }
//     //}
//   } catch (error) {
//     return res.status(500).send({ status: 500, message: error.message });
//   }
// };

// module.exports = email_Unsubscribe;

// const email_Unsubscribe = async (req, res) => {
//     try{
//         if(req.params.email !== "undefined") {
//             // When we unsubscribe, check for an email
//             const findemail = await findOne( "subscribe", {"email" : req.params.email });

//             if(findemail.length > 0) {
//                 // If it exists, remove it
//                 await subscribe.deleteOne({ "email" : req.params.email });
//                 res.status(200).send({ status:200, "message" : "Email deleted." });
//             }
//             else {
//                 // Otherwise the user wasn't even subscribed to begin with
//                 res.status(500).send({status:500, "message" : "Email doesn't exist."})
//             }
//         }

//     } catch(error) {
//         return res.status(500).send({status:500, message : error.message});
//     }
// }

// module.exports = email_Unsubscribe;
