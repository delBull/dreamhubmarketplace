const { find } = require("../../../helpers");

const getNfts = async (req, res) =>{
  
  try {
    const keyword = req.body.keyword.trim();

    const data = await find("nft", {
      $or: [
        { title: { $regex: new RegExp( keyword + ".*", "i") } },
        { abstraction: { $regex: new RegExp( keyword + ".*", "i")} },
      ],
    });

    ///.*query.*/

  //Limit search Reults to 10
 searchnft = data.slice(0,10);
 //return res.status(200).json({payload: search});

    if (!data || data.length <0 ,  keyword == "" ) return res.status(404).send({ status: 204, message: [] });
     //else return res.status(200).json({ status: 200, message: "Nfts get successfully" });
    

    const searchUser = await find("user", {
      full_Name: { $regex: new RegExp( keyword + ".*", "i") },
    });

//Limit search Reults to 10
//searchUser = searchUser.slice(0,10);


    if (!searchUser || searchUser.length < 0  || keyword == "") {
      return res
        .status(404)
        .json({ status: 204, message: [] });
    }

    const collection = await find("nftcollection", {
      collection_name: { $regex: new RegExp( keyword + ".*", "i") },
    });


    return res.status(200).json({ status: 200, message: "Users get successfully" , searchnft , searchUser,collection});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, message: error.message });
  }
};

module.exports = getNfts;

// const getNfts = async (req, res) => {
//   try {

//     const { title, abstraction } = req.bdoy
//     //const full_Name = req.body.full_Name.trim();

//     //  const findNfts = await find("nft", {$match: { $or: [{ 'title': { $regex:  abstraction, $options: 'i'} }, { 'abstraction': { $regex:  title, $options: 'i'} }] }});

//      const findNfts = await find("nft", {$match: { $or: [{ 'title': { $regex:  '.*', $options: 'i'} }, { 'abstraction': { $regex:  '.*', $options: 'i'} }] }});

//     // const payload = req.body.payload.trim();
//     // const search = await find("user", {"full_Name": {$regex: new RegExp('^'+payload+'.*','i')}}).select('full_Name).limit(10);

//     // //Limit search Reults to 10
//     // search = search.slice(0,10);
//     // return res.status(200).json({payload: search});

//     if (!findNfts) {
//       return res
//         .status(404)
//         .send({ status: 404, message: "Oops! No nfts found " });
//     }

//     return res.status(200).send({ status: 200, findNfts });
//   } catch (e) {
//     console.log(e);
//     return res.status(400).send({ status: 400, message: e.message });
//   }
// };
// module.exports = getNfts;
