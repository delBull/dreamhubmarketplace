const Joi = require("joi");
const { isValidURL, axiosGetCall, find, findOne } = require("../../../helpers");
const Moralis = require("moralis").default;

// const schema = Joi.object({
//   address: Joi.string().required(),
//   chain: Joi.string().required(),
//   cursor: Joi.string(),
//   limit: Joi.number().required(),
// });

const getContractNFTs = async (req, res) => {
  try {
    // await schema.validateAsync(req.query);
    const { address, chain } = req.query;
    //const address = address;
    const response = await Moralis.EvmApi.nft.getContractNFTs({
      address: address,
      chain: chain
    });
    const data = {
      ...response,
      result: [],
    };
    // var data = {
    //   total: response.total,
    //   page: response.page,
    //   page_size: response.page_size,
    //   cursor: response.cursor,
    //   result: [],
    // };
    await (async function loop() {
      for (let i = 0; i < response.result.length; i++) {
        if (isValidURL(response.result[i].tokenUri)) {
          const tokenUriData = await axiosGetCall(response.result[i]?.tokenUri);
          data.result.push({
            // data.push({
            ...response.result[i],
            ...tokenUriData,
          });
        } else {
          // data.push
          data.result.push(response.result[i]);
        }

      }

    })();

  //  const launchpad = await find("launchPad");


    // let launchData = launchpad.filter(obj => obj.contractAddress === address)
       
    // console.log(launchData, "launchData...");

// const launchpadData = [launchData]
// console.log(launchpadData, "launchpadData...");

    console.log("147:", data);
    // delete response.result;
    return res.status(200).json({
      status: 200,
      data: {
        moralis: data,
      //  launchPad: launchData
      },
      // response: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = getContractNFTs;
