const { find, findOne, getAggregate, updateDocument } = require("../../../helpers");

const { ObjectID } = require("../../../types");

const getRandomswapNftOffer = async (req, res) => {
    try {

        const { owner_id, nftId } = req.query;



        console.log(req.query, "swapnft.......");

        const nftForSwap = await findOne("nft", { _id: nftId });

        const multipleSwapWith = await find("multipleUser", { nftType: "swap", ownerId: { $ne: owner_id } });

        let randomNfts = multipleSwapWith[(Math.floor(Math.random() * 1000) % multipleSwapWith.length)]

        console.log(randomNfts, "randomNfts....");

        // Yeh woh nft hain jis se swap krna hain nft
        const nftSwapWith = await findOne("nft", { _id: randomNfts.nftId });



        //     // yeh function nft select kr reha hian randomly

        if (!nftForSwap) {
            return res.status(404).send({ status: 404, message: "NFT not found" });
        }

        const updateOwner = (ownerArr) => {
            let arr = ownerArr.map((a) => {
                return a.toString()
            })

            console.log(arr, 'foundddddddddd')
            let indexFound = arr.indexOf(owner_id)
            console.log(indexFound, owner_id, 'foundddddddddd')
            if (indexFound >= 0) {
                console.log('foundddddddddd')
                arr.splice(indexFound, 1, randomNfts.ownerId)
            }
            return arr
        }

        const updateOwner2 = (ownerArr) => {
            let arr = ownerArr.map((a) => {
                return a.toString()
            })

            console.log(arr, 'foundddddddddd')
            let indexFound = arr.indexOf((randomNfts.ownerId).toString())
            console.log(indexFound, randomNfts.ownerId, 'foundddddddddd')
            if (indexFound >= 0) {
                console.log('foundddddddddd')
                arr.splice(indexFound, 1, owner_id)
            }
            return arr
        }

        //     // yeh meri nft hain jis ko mein swap krna chata ho



        let ownerArr = nftForSwap.owner

        let nftForSwapObj = {
            ...nftForSwap._doc,
            owner: updateOwner(ownerArr),
            swapnftnumber: 0,
            nftType: 'mint'
        }


        let ownerArr2 = nftSwapWith.owner


        let nftSwapWithObj = {
            ...nftSwapWith._doc,
            owner: updateOwner2(ownerArr2),
            swapnftnumber: 0,
            nftType: 'mint'
        }

        //           // Yeh woh nft hain jis se swap krna hain nft
        const updateNftSwapWith = await updateDocument(
            "nft",
            {
                tokenAddress: nftSwapWith.tokenAddress,
                nft_tokenId: nftSwapWith.nft_tokenId
            },
            {

                ...nftSwapWithObj

            }
        );

        //         console.log(updateNftSwapWith, "updateNftSwapWith");


        // // yeh meri nft hain jis ko mein swap krna chata ho
        const updateNftForSwap = await updateDocument(
            "nft",
            {
                tokenAddress: nftForSwap.tokenAddress,
                nft_tokenId: nftForSwap.nft_tokenId
            },
            {

                ...nftForSwapObj
            }
        );

        //         console.log(updateNftForSwap, "updateNftForSwap");



        // Yeh meri nft hain 
        const MultipleNftForSwap = await findOne(
            "multipleUser",
            {
                nftId: nftId
            }
        );

        let MultipleNftForSwapObj = {
            ...MultipleNftForSwap._doc,
            swapnftnumber: "0",
            nftType: 'mint',
            ownerId: randomNfts.ownerId

        }


        // is se mein nft swap krna chata ho
        const MultipleNftWithSwap = await findOne(
            "multipleUser",
            {
                nftId: randomNfts.nftId
            }
        );

        let MultipleNftWithSwapObj = {
            ...MultipleNftWithSwap._doc,
            swapnftnumber: "0",
            nftType: 'mint',
            ownerId: owner_id

        }

        const updateMultipleNftForSwap = await updateDocument(
            "multipleUser",
            {
                nftId: nftId
            },
            {
                ...MultipleNftForSwapObj
            }
        );

        const updateMultipleNftWithSwap = await updateDocument(
            "multipleUser",
            {
                nftId: randomNfts.nftId
            },
            {
                ...MultipleNftWithSwapObj
            }
        );

      // //history should be maintain

      const history = await insertNewDocument("history", {
        nft_id: check_bid.nft_id,
        action: "offer accepted",
        from: req.userId,
        price: check_bid.bid_price,
        to: bidder_id,
    });

        return res
            .status(200)
            .send({
                status: 200,
                nft: {
                    nftForSwap: { ...nftForSwapObj },
                    nftWithSwap: { ...nftSwapWithObj }
                },
                multipleUser: {
                    nftForSwap: { ...MultipleNftForSwapObj },
                    nftWithSwap: { ...MultipleNftWithSwapObj }
                },
                nftForSwap: nftForSwap,
                randomNfts: randomNfts,
                nftSwapWith: nftSwapWith,
                message: "swap offer accepted successfully"
            });




    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 500, message: e.message });
    }
};

module.exports = getRandomswapNftOffer;



// // Yeh meri nft hain
//         const updateMultipleNftForSwap = await updateDocument(
//             "multipleUser",
//             {
//                 nftId: ownernft_id
//             },
//             {
//                 ...MultipleNftForSwapObj
//             }
//         );


//         const updateMultipleNftWithSwap = await updateDocument(
//             "multipleUser",
//             {
//                 nftId: biddernft_id
//             },
//             {
//                 ...MultipleNftWithSwapObj
//             }
//         );


// // Delete swapbid nft database after swaping
// const check_bid = await findOne("swapbid", {
//     _id: _id,
//     bidder_id,
// });


// if (!check_bid) {
//     return res.status(404).send({ status: 404, message: "no bid found" });
// }
//         const deleteBids = await deleteManyDocument("swapbid", {
//             nft_id: check_bid.nft_id,
//         });

