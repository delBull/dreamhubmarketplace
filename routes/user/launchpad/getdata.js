const { findOne, find } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const launchApprovedData = async (req, res) => {
  try {
    
    const launchpad = await find("launchPad");


    let approvedData = launchpad.filter(obj => obj.status === "approved")
       
    console.log(approvedData, "approvedData..."); 
   
   

    return res.status(200).send({ status: 200, msg:"User get the launchpad data successfully" , approvedData });

  } catch (e) {

    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = launchApprovedData;
