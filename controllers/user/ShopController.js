
const config = require("../../config/config");
const errorLog = require("../../config/logger");
const { calculateTimePeriod, addHoursToTime, isTimeGreaterThan } = require("../../helpers/main");
const commonServices = require("../../servicves/commonServices");

let shopController = {};

// shopController.nearByShop = async (req, res) => {
//   try {
//     const result = await commonServices.getByCustomFieldMultiple(
//       "shops",
//       "Isdelete",
//       "0"
//     );
//     if (result) {
//       let datas = [];
//       const distanceLimit = 40;
//       let currentDistance = 5;

//       while (currentDistance <= distanceLimit) {
//         for (let r of result) {
//           var distance = config.getDistanceFromLatLonInKm(
//             req?.body?.lat,
//             req?.body?.lng,
//             r?.lat,
//             r?.lng
//           );
//           if (distance <= currentDistance) {
//             datas.push({
//               ...r,
//               countryName: (await commonServices.getById("country", r?.country))
//                 ?.name,
//               stateName: (await commonServices.getById("state", r?.state))
//                 ?.name,
//               cityName: (await commonServices.getById("state", r?.city))?.name,
//               branchName: (await commonServices.getById("branch", r?.branchId))
//                 ?.name,
//               imageUrl: await config.getImageSingedUrlById(r?.file),
//             });
//           }
//         }
//         if (datas.length > 0) {
//           break;
//         }
//         currentDistance = currentDistance + 5;
//       }

//       return config.response(200, "Shop list get Successfully!", datas, res);
//     } else {
//       return config.response(201, "Something went Wrong!", {}, res);
//     }
//   } catch (error) {
//     errorLog(error);
//     return config.response(201, "Something went Wrong!", { error }, res);
//   }
// };





// Add sub-services

shopController.nearByShop = async (req, res) => {
  try {
    const result = await commonServices.getByCustomFieldMultiple(
      "shops",
      "Isdelete",
      "0"
    );
    if (result) {
      let datas = [];
      const distanceLimit = 40;
      let currentDistance = 5;
      // const distanceFilter = req.body.distance;
      const minDistanceFilter = req.body.minDistance;
      const maxDistanceFilter = req.body.maxDistance;

      if (minDistanceFilter && maxDistanceFilter) {
        for (let r of result) {
          var distance = config.getDistanceFromLatLonInKm(
            req?.body?.lat,
            req?.body?.lng,
            r?.lat,
            r?.lng
          );

          if (distance <= minDistanceFilter && distance >= maxDistanceFilter) {
            datas.push({
              ...r,
              countryName: (await commonServices.getById("country", r?.country))
                ?.name,
              stateName: (await commonServices.getById("state", r?.state))
                ?.name,
              cityName: (await commonServices.getById("state", r?.city))?.name,
              branchName: (await commonServices.getById("branch", r?.branchId))
                ?.name,
              imageUrl: await config.getImageSingedUrlById(r?.file),
            });
          }
        }
      }
      else {
        while (currentDistance <= distanceLimit) {
          for (let r of result) {
            var distance = config.getDistanceFromLatLonInKm(
              req?.body?.lat,
              req?.body?.lng,
              r?.lat,
              r?.lng
            );

            if (distance <= currentDistance) {
              datas.push({
                ...r,
                countryName: (await commonServices.getById("country", r?.country))
                  ?.name,
                stateName: (await commonServices.getById("state", r?.state))
                  ?.name,
                cityName: (await commonServices.getById("state", r?.city))?.name,
                branchName: (await commonServices.getById("branch", r?.branchId))
                  ?.name,
                imageUrl: await config.getImageSingedUrlById(r?.file),
              });
            }
          }
          if (datas.length > 0) {
            break;
          }
          currentDistance = currentDistance + 5;
        }
      }


      return config.response(200, "Shop list get Successfully!", datas, res);
    } else {
      return config.response(201, "Something went Wrong!", {}, res);
    }
  } catch (error) {
    errorLog(error);
    return config.response(201, "Something went Wrong!", { error }, res);
  }
};

// shopController.nearByServices = async (req, res) => {
//   try {
//     const result = await commonServices.getByCustomFieldMultiple(
//       "shops",
//       "Isdelete",
//       "0"
//     );
//     if (result) {
//       let datas = [];
//       const distanceLimit = 40;
//       let currentDistance = 5;



//       while (currentDistance <= distanceLimit) {
//         for (let r of result) {
//           var distance = config.getDistanceFromLatLonInKm(
//             req?.body?.lat,
//             req?.body?.lng,
//             r?.lat,
//             r?.lng
//           );

//           if (distance <= currentDistance) {
//             let tempService = await commonServices.getByCustomFieldMultiple(
//               "service",
//               "shopId",
//               r?.id
//             );

//             if (tempService.length > 0) {
//               let shopService = JSON.parse(JSON.stringify(r));
//               shopService.service = tempService;

//               for (const s of tempService) {
//                 let tempSubService = [];

//                 if (
//                   req.body.personType &&
//                   (req.body.personType === 1 ||
//                     req.body.personType === 2 ||
//                     req.body.personType === 3)
//                 ) {
//                   tempSubService = await commonServices.getByCustom2Field(
//                     "sub_services",
//                     "serviceId",
//                     s?.id,
//                     "persontype",
//                     req.body.personType
//                   );
//                 } else {
//                   tempSubService =
//                     await commonServices.getByCustomFieldMultiple(
//                       "sub_services",
//                       "serviceId",
//                       s?.id
//                     );
//                 }

//                 if (tempSubService.length > 0) {
//                   let subServiceToShow = [];

//                   for (const soloSubServe of tempSubService) {
//                     let imageOfService = await config.getImageSingedUrlById(
//                       soloSubServe?.file
//                     );
//                     subServiceToShow.push({
//                       ...soloSubServe,
//                       shop: r,
//                       image: imageOfService,
//                     });
//                   }

//                   datas.push({ ...s, subService: subServiceToShow });
//                 }
//               }
//             }
//           }
//         }

//         if (datas.length > 0) {
//           break;
//         }
//         currentDistance = currentDistance + 5;
//       }

//       return config.response(200, "Service list get successfully!", datas, res);
//     } else {
//       return config.response(400, "Something went Wrong!", {}, res);
//     }
//   } catch (error) {
//     errorLog(error);
//     return config.response(400, "Something went Wrong!", { error }, res);
//   }
// };

shopController.nearByServices = async (req, res) => {
  try {
    const result = await commonServices.getByCustomFieldMultiple(
      "shops",
      "Isdelete",
      "0"
    );

    if (!result) {
      return config.response(400, "Something went Wrong!", {}, res);
    }

    let datas = [];
    const distanceLimit = 40;
    let currentDistance = 5;
    const distanceFilter = req.body.distance;
    const minPriceFilter = req.body.min;
    const maxPriceFilter = req.body.max;
    const minOfferFilter = req.body.minOffer;
    const maxOfferFilter = req.body.maxOffer;
    const serviceTypeIdFilter = req.body.serviceTypeId;

    // Filter shops based on distance

    if (distanceFilter) {
      for (let r of result) {
        var distance = config.getDistanceFromLatLonInKm(
          req?.body?.lat,
          req?.body?.lng,
          r?.lat,
          r?.lng
        );

        if (distance <= distanceFilter) {
          let tempService = await commonServices.getByCustomFieldMultiple(
            "service",
            "shopId",
            r?.id
          );

          if (tempService.length > 0) {
            let shopService = JSON.parse(JSON.stringify(r));
            shopService.service = tempService;
            // Filter shops based on serviceTypeId
            if (serviceTypeIdFilter) {
              tempService = tempService.filter((item) => item.serviceTypeId === serviceTypeIdFilter)

            }

            for (const s of tempService) {
              let tempSubService = [];


              if (
                req.body.personType &&
                (req.body.personType === 1 ||
                  req.body.personType === 2 ||
                  req.body.personType === 3)
              ) {
                tempSubService = await commonServices.getByCustom2Field(
                  "sub_services",
                  "serviceId",
                  s?.id,
                  "persontype",
                  req.body.personType
                );


              } else {
                tempSubService =
                  await commonServices.getByCustomFieldMultiple(
                    "sub_services",
                    "serviceId",
                    s?.id
                  );
              }

              if (tempSubService.length > 0) {
                let subServiceToShow = [];


                // Filter shops based on Price
                if (minPriceFilter && maxPriceFilter) {
                  tempSubService = tempSubService.filter((item) => item.price >= Number(minPriceFilter) && item.price <= Number(maxPriceFilter));

                }
                // Filter shops based on Offer
                if (minOfferFilter && maxOfferFilter) {
                  tempSubService = tempSubService.filter((item) => Number(item.offer) >= Number(minOfferFilter) && Number(item.offer) <= Number(maxOfferFilter));

                }
                for (const soloSubServe of tempSubService) {
                  let imageOfService = await config.getImageSingedUrlById(
                    soloSubServe?.file
                  );
                  subServiceToShow.push({
                    ...soloSubServe,
                    shop: r,
                    image: imageOfService,
                  });
                }

                datas.push({ ...s, subService: subServiceToShow });
              }
            }
          }
        }
      }
    } else {
      while (currentDistance <= distanceLimit) {
        for (let r of result) {
          var distance = config.getDistanceFromLatLonInKm(
            req?.body?.lat,
            req?.body?.lng,
            r?.lat,
            r?.lng
          );

          if (distance <= currentDistance) {
            let tempService = await commonServices.getByCustomFieldMultiple(
              "service",
              "shopId",
              r?.id
            );

            if (tempService.length > 0) {
              let shopService = JSON.parse(JSON.stringify(r));
              shopService.service = tempService;
              // Filter shops based on serviceTypeId
              if (serviceTypeIdFilter) {
                tempService = tempService.filter((item) => item.serviceTypeId === serviceTypeIdFilter)

              }

              for (const s of tempService) {
                let tempSubService = [];


                if (
                  req.body.personType &&
                  (req.body.personType === 1 ||
                    req.body.personType === 2 ||
                    req.body.personType === 3)
                ) {
                  tempSubService = await commonServices.getByCustom2Field(
                    "sub_services",
                    "serviceId",
                    s?.id,
                    "persontype",
                    req.body.personType
                  );


                } else {
                  tempSubService =
                    await commonServices.getByCustomFieldMultiple(
                      "sub_services",
                      "serviceId",
                      s?.id
                    );
                }

                if (tempSubService.length > 0) {
                  let subServiceToShow = [];


                  // Filter shops based on Price
                  if (minPriceFilter && maxPriceFilter) {
                    tempSubService = tempSubService.filter((item) => item.price >= Number(minPriceFilter) && item.price <= Number(maxPriceFilter));

                  }
                  // Filter shops based on Offer
                  if (minOfferFilter && maxOfferFilter) {
                    tempSubService = tempSubService.filter((item) => Number(item.offer) >= Number(minOfferFilter) && Number(item.offer) <= Number(maxOfferFilter));

                  }
                  for (const soloSubServe of tempSubService) {
                    let imageOfService = await config.getImageSingedUrlById(
                      soloSubServe?.file
                    );
                    subServiceToShow.push({
                      ...soloSubServe,
                      shop: r,
                      image: imageOfService,
                    });
                  }

                  datas.push({ ...s, subService: subServiceToShow });
                }
              }
            }
          }
        }

        if (datas.length > 0) {
          break;
        }
        currentDistance = currentDistance + 5;
      }
    }





    return config.response(200, "Service list get successfully!", datas, res);
  } catch (error) {
    errorLog(error);
    return config.response(400, "Something went Wrong!", { error }, res);
  }
};


// shopController.nearByPackages = async (req, res) => {
//   try {
//     const result = await commonServices.getByCustomFieldMultiple(
//       "shops",
//       "Isdelete",
//       "0"
//     );

//     if (!result || result.length === 0) {
//       return config.response(201, "No shops found!", {}, res);
//     }

//     const datas = [];
//     const distanceLimit = 40;
//     let currentDistance = 5;

//     while (currentDistance <= distanceLimit) {
//       for (const shop of result) {
//         const distance = config.getDistanceFromLatLonInKm(
//           req?.body?.lat,
//           req?.body?.lng,
//           shop?.lat,
//           shop?.lng
//         );

//         if (distance <= currentDistance) {
//           const shopPackages = await commonServices.getByCustomFieldMultiple(
//             "packages",
//             "shopId",
//             shop.id
//           );

//           if (shopPackages.length > 0) {
//             for (const pkg of shopPackages) {
//               if (pkg?.serviceId) {
//                 const serviceIdArray = JSON.parse(pkg.serviceId);
//                 const packageServices = [];

//                 for (const serviceData of serviceIdArray) {
//                   const packageService =
//                     await commonServices.getByCustomFieldSingle(
//                       "service",
//                       "id",
//                       serviceData.id
//                     );

//                   if (serviceData.subServiceId) {
//                     const subServiceIds = serviceData.subServiceId.split(",");
//                     const packageSubServices = [];
//                     for (const subServiceId of subServiceIds) {
//                       const packageSubService =
//                         await commonServices.getByCustomFieldSingle(
//                           "sub_services",
//                           "id",
//                           subServiceId.trim()
//                         );
//                       if (packageSubService) {
//                         const imageOfSubServices =
//                           await config.getImageSingedUrlById(
//                             packageSubService.file
//                           );
//                         packageSubService.image = imageOfSubServices;
//                         packageSubServices.push(packageSubService);
//                       }
//                     }
//                     packageService.subService = packageSubServices;
//                     packageServices.push(packageService);
//                   }

//                   const imageOfPackage = await config.getImageSingedUrlById(
//                     pkg.file
//                   );

//                   const tempPack = {
//                     ...pkg,
//                     shop,
//                     service: packageServices,
//                     image: imageOfPackage,
//                   };

//                   datas.push(tempPack);
//                 }
//               }
//             }
//           }
//         }
//       }

//       if (datas.length > 0) {
//         break;
//       }

//       currentDistance += 5;
//     }

//     if (datas.length > 0) {
//       return config.response(
//         200,
//         "Package list retrieved successfully!",
//         datas,
//         res
//       );
//     } else {
//       return config.response(
//         201,
//         "No packages found within the specified distance!",
//         {},
//         res
//       );
//     }
//   } catch (error) {
//     errorLog(error);
//     return config.response(500, "Internal server error!", { error }, res);
//   }
// };



// shopController.nearByMemberships = async (req, res) => {
//   try {
//     const result = await commonServices.getByCustomFieldMultiple(
//       "shops",
//       "Isdelete",
//       "0"
//     );

//     if (result) {
//       let datas = [];
//       const distanceLimit = 40;
//       let currentDistance = 5;

//       while (currentDistance <= distanceLimit) {
//         for (let r of result) {
//           var distance = config.getDistanceFromLatLonInKm(
//             req?.body?.lat,
//             req?.body?.lng,
//             r?.lat,
//             r?.lng
//           );

//           if (distance <= currentDistance) {
//             let shopMemberships = await commonServices.getByCustomFieldMultiple(
//               "memberships",
//               "shopId",
//               r.id
//             );

//             if (shopMemberships.length > 0) {
//               for (const membership of shopMemberships) {
//                 let tempPack = { ...membership };
//                 tempPack.shop = r;

//                 let imageOfMembeship = await config.getImageSingedUrlById(
//                   membership?.file
//                 );
//                 tempPack.image = imageOfMembeship;

//                 let membershipService =
//                   await commonServices.getByCustomFieldSingle(
//                     "service",
//                     "id",
//                     membership.serviceId
//                   );

//                 if (membership.subServiceId) {
//                   let membershipSubService =
//                     await commonServices.getByCustomFieldSingle(
//                       "sub_services",
//                       "id",
//                       membership.subServiceId
//                     );

//                   membershipService.subService = membershipSubService;
//                 }

//                 tempPack.service = membershipService;
//                 datas.push(tempPack);
//               }
//             }
//           }
//         }

//         if (datas.length > 0) {
//           break;
//         }
//         currentDistance = currentDistance + 5;
//       }

//       return config.response(200, "Package list get successfully!", datas, res);
//     } else {
//       return config.response(201, "Something went Wrong!", {}, res);
//     }
//   } catch (error) {
//     errorLog(error);
//     return config.response(201, "Something went Wrong!", { error }, res);
//   }
// };

shopController.nearByPackages = async (req, res) => {
  try {
    const result = await commonServices.getByCustomFieldMultiple(
      "shops",
      "Isdelete",
      "0"
    );

    if (!result || result.length === 0) {
      return config.response(201, "No shops found!", {}, res);
    }

    let datas = [];
    const distanceLimit = 40;
    let currentDistance = 5;
    const minPriceFilter = req.body.min;
    const maxPriceFilter = req.body.max;


    while (currentDistance <= distanceLimit) {
      for (const shop of result) {
        const distance = config.getDistanceFromLatLonInKm(
          req?.body?.lat,
          req?.body?.lng,
          shop?.lat,
          shop?.lng
        );

        if (distance <= currentDistance) {
          const shopPackages = await commonServices.getByCustomFieldMultiple(
            "packages",
            "shopId",
            shop.id
          );

          if (shopPackages.length > 0) {
            for (const pkg of shopPackages) {
              if (pkg?.serviceId) {
                const serviceIdArray = JSON.parse(pkg.serviceId);
                const packageServices = [];

                for (const serviceData of serviceIdArray) {
                  const packageService =
                    await commonServices.getByCustomFieldSingle(
                      "service",
                      "id",
                      serviceData.id
                    );

                  if (serviceData.subServiceId) {
                    const subServiceIds = serviceData.subServiceId.split(",");
                    const packageSubServices = [];
                    for (const subServiceId of subServiceIds) {
                      const packageSubService =
                        await commonServices.getByCustomFieldSingle(
                          "sub_services",
                          "id",
                          subServiceId.trim()
                        );
                      if (packageSubService) {
                        const imageOfSubServices =
                          await config.getImageSingedUrlById(
                            packageSubService.file
                          );
                        packageSubService.image = imageOfSubServices;
                        packageSubServices.push(packageSubService);
                      }
                    }
                    packageService.subService = packageSubServices;
                    packageServices.push(packageService);
                  }

                  const imageOfPackage = await config.getImageSingedUrlById(
                    pkg.file
                  );

                  const tempPack = {
                    ...pkg,
                    shop,
                    service: packageServices,
                    image: imageOfPackage,
                  };

                  datas.push(tempPack);
                }
              }
            }
          }
        }
      }

      if (datas.length > 0) {
        break;
      }

      currentDistance += 5;
    }
    if (minPriceFilter && maxPriceFilter) {
      datas = datas.filter((item) => item.price >= Number(minPriceFilter) && item.price <= Number(maxPriceFilter));

      if (datas.length === 0) {
        return config.response(
          201,
          "No packages found within the specified price range!",
          {},
          res
        );
      }
    }


    if (datas.length > 0) {
      return config.response(
        200,
        "Package list retrieved successfully!",
        datas,
        res
      );
    } else {
      return config.response(
        201,
        "No packages found within the specified distance!",
        {},
        res
      );
    }
  } catch (error) {
    errorLog(error);
    return config.response(500, "Internal server error!", { error }, res);
  }
};

shopController.nearByMemberships = async (req, res) => {
  try {
    const result = await commonServices.getByCustomFieldMultiple(
      "shops",
      "Isdelete",
      "0"
    );

    if (result) {
      let datas = [];
      const distanceLimit = 40;
      let currentDistance = 5;
      const distanceFilter = req.body.distance;
      const minPriceFilter = req.body.min;
      const maxPriceFilter = req.body.max;
      const minOfferFilter = req.body.minOffer;
      const maxOfferFilter = req.body.maxOffer;
      const serviceTypeIdFilter = req.body.serviceTypeId;

      if (distanceFilter) {
        for (let r of result) {
          var distance = config.getDistanceFromLatLonInKm(
            req?.body?.lat,
            req?.body?.lng,
            r?.lat,
            r?.lng
          );

          if (distance <= currentDistance) {
            let shopMemberships = await commonServices.getByCustomFieldMultiple(
              "memberships",
              "shopId",
              r.id
            );

            if (shopMemberships.length > 0) {
              for (const membership of shopMemberships) {
                let tempPack = { ...membership };
                tempPack.shop = r;

                let imageOfMembeship = await config.getImageSingedUrlById(
                  membership?.file
                );
                tempPack.image = imageOfMembeship;

                let membershipService =
                  await commonServices.getByCustomFieldSingle(
                    "service",
                    "id",
                    membership.serviceId
                  );

                if (membership.subServiceId) {
                  let membershipSubService =
                    await commonServices.getByCustomFieldSingle(
                      "sub_services",
                      "id",
                      membership.subServiceId
                    );

                  membershipService.subService = membershipSubService;
                }

                tempPack.service = membershipService;
                datas.push(tempPack);
              }
            }
          }
        }
      }
      else {
        while (currentDistance <= distanceLimit) {
          for (let r of result) {
            var distance = config.getDistanceFromLatLonInKm(
              req?.body?.lat,
              req?.body?.lng,
              r?.lat,
              r?.lng
            );

            if (distance <= currentDistance) {
              let shopMemberships = await commonServices.getByCustomFieldMultiple(
                "memberships",
                "shopId",
                r.id
              );

              if (shopMemberships.length > 0) {
                for (const membership of shopMemberships) {
                  let tempPack = { ...membership };
                  tempPack.shop = r;

                  let imageOfMembeship = await config.getImageSingedUrlById(
                    membership?.file
                  );
                  tempPack.image = imageOfMembeship;

                  let membershipService =
                    await commonServices.getByCustomFieldSingle(
                      "service",
                      "id",
                      membership.serviceId
                    );

                  if (membership.subServiceId) {
                    let membershipSubService =
                      await commonServices.getByCustomFieldSingle(
                        "sub_services",
                        "id",
                        membership.subServiceId
                      );

                    membershipService.subService = membershipSubService;
                  }

                  tempPack.service = membershipService;
                  datas.push(tempPack);
                }
              }
            }
          }

          if (datas.length > 0) {
            break;
          }
          currentDistance = currentDistance + 5;
        }
      }


      if (minPriceFilter && maxPriceFilter) {
        datas = datas.filter((item) => item.price >= Number(minPriceFilter) && item.price <= Number(maxPriceFilter));

        if (datas.length === 0) {
          return config.response(
            201,
            "No packages found within the specified price range!",
            {},
            res
          );
        }
      }

      if (minOfferFilter && maxOfferFilter) {
        datas = datas.filter((item) => Number(item.offer) >= Number(minOfferFilter) && Number(item.offer) <= Number(maxOfferFilter));

        if (datas.length === 0) {
          return config.response(
            201,
            "No packages found within the specified offer!",
            {},
            res
          );
        }
      }
      if (serviceTypeIdFilter) {
        datas = datas.filter((item) => item.serviceTypeId === serviceTypeIdFilter)
        if (datas.length === 0) {
          return config.response(
            201,
            "No packages found within the specified service typr id!",
            {},
            res
          );
        }
      }

      return config.response(200, "Package list get successfully!", datas, res);
    } else {
      return config.response(201, "Something went Wrong!", {}, res);
    }
  } catch (error) {
    errorLog(error);
    return config.response(201, "Something went Wrong!", { error }, res);
  }
};


// shopController.nearByElements = async (req, res) => {
//   try {
//     const result = await commonServices.getByCustomFieldMultiple(
//       "shops",
//       "Isdelete",
//       "0"
//     );
//     if (result) {
//       let datas = [];
//       const distanceLimit = 40;
//       let currentDistance = 5;


//       while (currentDistance <= distanceLimit) {
//         for (let r of result) {
//           let dataObj = { ...r };

//           var distance = config.getDistanceFromLatLonInKm(
//             req?.body?.lat,
//             req?.body?.lng,
//             r?.lat,
//             r?.lng
//           );

//           if (distance <= currentDistance) {
//             // Service with subServices start
//             let serviceArr = await commonServices.getByCustomFieldMultiple(
//               "service",
//               "shopId",
//               r.id
//             );

//             if (serviceArr.length) {
//               for (const service of serviceArr) {
//                 let subServices = await commonServices.getByCustomFieldMultiple(
//                   "sub_services",
//                   "serviceId",
//                   service.id
//                 );

//                 if (subServices.length > 0) {
//                   subServices = await Promise.all(subServices.map(async (item) => {
//                     let imgOfSubService = await config.getImageSingedUrlById(item.file);
//                     item.image = imgOfSubService;
//                     return item;
//                   }))
//                 }

//                 /////

//                 service.subService = subServices;
//               }
//             }
//             dataObj.services = serviceArr;
//             // Service with subServices end

//             // Packages Start
//             let shopPackages = await commonServices.getByCustomFieldMultiple(
//               "packages",
//               "shopId",
//               r.id
//             );
//             let newShopPackages = [];

//             for (let package of shopPackages) {
//               let tempPck = { ...package };
//               let img = await config.getImageSingedUrlById(package.file);
//               tempPck.image = img;
//               tempPck.serviceId = JSON.parse(tempPck.serviceId);

//               let serviceDetailsAtt = [];

//               for (const serve of tempPck.serviceId) {
//                 let serviceDetail = await commonServices.getByCustomFieldSingle(
//                   "service",
//                   "id",
//                   serve.id
//                 );
//                 serviceDetail.subService =
//                   await commonServices.getByCustomFieldSingle(
//                     "sub_services",
//                     "id",
//                     serve.subServiceId
//                   );
//                 serviceDetailsAtt.push(serviceDetail);
//               }
//               tempPck.serviceDetail = serviceDetailsAtt;

//               newShopPackages.push(tempPck);
//             }
//             dataObj.package = newShopPackages;
//             // Packages End

//             // Membership Start

//             let shopMemberships = await commonServices.getByCustomFieldMultiple(
//               "memberships",
//               "shopId",
//               r.id
//             );
//             let newShopMemberships = [];

//             for (let membership of shopMemberships) {
//               let tempMemShip = { ...membership };
//               let img = await config.getImageSingedUrlById(membership.file);
//               tempMemShip.image = img;
//               let getService = await commonServices.getByCustomFieldSingle(
//                 "service",
//                 "id",
//                 membership.serviceId
//               );
//               getService.subService =
//                 await commonServices.getByCustomFieldSingle(
//                   "sub_services",
//                   "id",
//                   membership.subServiceId
//                 );
//               tempMemShip.service = getService;
//               newShopMemberships.push(tempMemShip);
//             }

//             dataObj.membership = newShopMemberships;

//             // Membership End

//             dataObj.countryName = (
//               await commonServices.getById("country", r?.country)
//             )?.name;
//             dataObj.stateName = (
//               await commonServices.getById("state", r?.state)
//             )?.name;
//             dataObj.cityName = (
//               await commonServices.getById("state", r?.city)
//             )?.name;
//             dataObj.branchName = (
//               await commonServices.getById("branch", r?.branchId)
//             )?.name;
//             dataObj.imageUrl = await config.getImageSingedUrlById(r?.file);

//             datas.push(dataObj);
//           }
//         }

//         if (datas.length > 0) {
//           break;
//         }
//         currentDistance = currentDistance + 5;
//       }



//       return config.response(200, "Shop list get Successfully!", datas, res);
//     } else {
//       return config.response(400, "Something went Wrong!", {}, res);
//     }
//   } catch (error) {
//     errorLog(error);
//     return config.response(400, "Something went Wrong!", { error }, res);
//   }
// };

shopController.nearByElements = async (req, res) => {
  try {
    const result = await commonServices.getByCustomFieldMultiple(
      "shops",
      "Isdelete",
      "0"
    );
    if (result) {
      let datas = [];
      const distanceLimit = 40;
      let currentDistance = 5;
      const distanceFilter = req.body.distance;

      if (distanceFilter) {
        for (let r of result) {
          let dataObj = { ...r };

          var distance = config.getDistanceFromLatLonInKm(
            req?.body?.lat,
            req?.body?.lng,
            r?.lat,
            r?.lng
          );

          if (distance <= distanceFilter) {
            // Service with subServices start
            let serviceArr = await commonServices.getByCustomFieldMultiple(
              "service",
              "shopId",
              r.id
            );

            if (serviceArr.length) {
              for (const service of serviceArr) {
                let subServices = await commonServices.getByCustomFieldMultiple(
                  "sub_services",
                  "serviceId",
                  service.id
                );

                if (subServices.length > 0) {
                  subServices = await Promise.all(subServices.map(async (item) => {
                    let imgOfSubService = await config.getImageSingedUrlById(item.file);
                    item.image = imgOfSubService;
                    return item;
                  }))
                }

                service.subService = subServices;
              }
            }
            dataObj.services = serviceArr;
            // Service with subServices end

            // Packages Start
            let shopPackages = await commonServices.getByCustomFieldMultiple(
              "packages",
              "shopId",
              r.id
            );
            let newShopPackages = [];

            for (let package of shopPackages) {
              let tempPck = { ...package };
              let img = await config.getImageSingedUrlById(package.file);
              tempPck.image = img;
              tempPck.serviceId = JSON.parse(tempPck.serviceId);

              let serviceDetailsAtt = [];

              for (const serve of tempPck.serviceId) {
                let serviceDetail = await commonServices.getByCustomFieldSingle(
                  "service",
                  "id",
                  serve.id
                );
                serviceDetail.subService =
                  await commonServices.getByCustomFieldSingle(
                    "sub_services",
                    "id",
                    serve.subServiceId
                  );
                serviceDetailsAtt.push(serviceDetail);
              }
              tempPck.serviceDetail = serviceDetailsAtt;

              newShopPackages.push(tempPck);
            }
            dataObj.package = newShopPackages;
            // Packages End

            // Membership Start

            let shopMemberships = await commonServices.getByCustomFieldMultiple(
              "memberships",
              "shopId",
              r.id
            );
            let newShopMemberships = [];

            for (let membership of shopMemberships) {
              let tempMemShip = { ...membership };
              let img = await config.getImageSingedUrlById(membership.file);
              tempMemShip.image = img;
              let getService = await commonServices.getByCustomFieldSingle(
                "service",
                "id",
                membership.serviceId
              );
              getService.subService =
                await commonServices.getByCustomFieldSingle(
                  "sub_services",
                  "id",
                  membership.subServiceId
                );
              tempMemShip.service = getService;
              newShopMemberships.push(tempMemShip);
            }

            dataObj.membership = newShopMemberships;

            // Membership End

            dataObj.countryName = (
              await commonServices.getById("country", r?.country)
            )?.name;
            dataObj.stateName = (
              await commonServices.getById("state", r?.state)
            )?.name;
            dataObj.cityName = (
              await commonServices.getById("state", r?.city)
            )?.name;
            dataObj.branchName = (
              await commonServices.getById("branch", r?.branchId)
            )?.name;
            dataObj.imageUrl = await config.getImageSingedUrlById(r?.file);

            datas.push(dataObj);
          }
        }
      } else {
        while (currentDistance <= distanceLimit) {
          for (let r of result) {
            let dataObj = { ...r };

            var distance = config.getDistanceFromLatLonInKm(
              req?.body?.lat,
              req?.body?.lng,
              r?.lat,
              r?.lng
            );

            if (distance <= currentDistance) {
              // Service with subServices start
              let serviceArr = await commonServices.getByCustomFieldMultiple(
                "service",
                "shopId",
                r.id
              );

              if (serviceArr.length) {
                for (const service of serviceArr) {
                  let subServices = await commonServices.getByCustomFieldMultiple(
                    "sub_services",
                    "serviceId",
                    service.id
                  );

                  if (subServices.length > 0) {
                    subServices = await Promise.all(subServices.map(async (item) => {
                      let imgOfSubService = await config.getImageSingedUrlById(item.file);
                      item.image = imgOfSubService;
                      return item;
                    }))
                  }

                  /////

                  service.subService = subServices;
                }
              }
              dataObj.services = serviceArr;
              // Service with subServices end

              // Packages Start
              let shopPackages = await commonServices.getByCustomFieldMultiple(
                "packages",
                "shopId",
                r.id
              );
              let newShopPackages = [];

              for (let package of shopPackages) {
                let tempPck = { ...package };
                let img = await config.getImageSingedUrlById(package.file);
                tempPck.image = img;
                tempPck.serviceId = JSON.parse(tempPck.serviceId);

                let serviceDetailsAtt = [];

                for (const serve of tempPck.serviceId) {
                  let serviceDetail = await commonServices.getByCustomFieldSingle(
                    "service",
                    "id",
                    serve.id
                  );
                  serviceDetail.subService =
                    await commonServices.getByCustomFieldSingle(
                      "sub_services",
                      "id",
                      serve.subServiceId
                    );
                  serviceDetailsAtt.push(serviceDetail);
                }
                tempPck.serviceDetail = serviceDetailsAtt;

                newShopPackages.push(tempPck);
              }
              dataObj.package = newShopPackages;
              // Packages End

              // Membership Start

              let shopMemberships = await commonServices.getByCustomFieldMultiple(
                "memberships",
                "shopId",
                r.id
              );
              let newShopMemberships = [];

              for (let membership of shopMemberships) {
                let tempMemShip = { ...membership };
                let img = await config.getImageSingedUrlById(membership.file);
                tempMemShip.image = img;
                let getService = await commonServices.getByCustomFieldSingle(
                  "service",
                  "id",
                  membership.serviceId
                );
                getService.subService =
                  await commonServices.getByCustomFieldSingle(
                    "sub_services",
                    "id",
                    membership.subServiceId
                  );
                tempMemShip.service = getService;
                newShopMemberships.push(tempMemShip);
              }

              dataObj.membership = newShopMemberships;

              // Membership End

              dataObj.countryName = (
                await commonServices.getById("country", r?.country)
              )?.name;
              dataObj.stateName = (
                await commonServices.getById("state", r?.state)
              )?.name;
              dataObj.cityName = (
                await commonServices.getById("state", r?.city)
              )?.name;
              dataObj.branchName = (
                await commonServices.getById("branch", r?.branchId)
              )?.name;
              dataObj.imageUrl = await config.getImageSingedUrlById(r?.file);

              datas.push(dataObj);
            }
          }

          if (datas.length > 0) {
            break;
          }
          currentDistance = currentDistance + 5;
        }
      }


      // console.log("Datas===============================>", datas)
      return config.response(200, "Shop list get Successfully!", datas, res);
    } else {
      return config.response(400, "Something went Wrong!", {}, res);
    }
  } catch (error) {
    errorLog(error);
    return config.response(400, "Something went Wrong!", { error }, res);
  }
};

shopController.getSlotsBySubService = async (req, res) => {
  try {

    // const now = new Date();
    // const hours = String(now.getHours()).padStart(2, '0');
    // const minutes = String(now.getMinutes()).padStart(2, '0');
    // const currentTime = `${hours}:${minutes}`;
    const currentTime = req.body.currentTime;

    const subServiceId = req?.body?.subServiceId;
    const slotDate = req?.body?.date;

    let subServiceDetails = await commonServices.getByCustomFieldSingle(
      "sub_services",
      "id",
      subServiceId
    );

    const serviceTimePeriod = parseInt(subServiceDetails.timeTaken) / 60;
    let serviceDetails = await commonServices.getByCustomFieldSingle(
      "service",
      "id",
      subServiceDetails.serviceId
    );

    const shopId = serviceDetails.shopId;
    let employeeList = await commonServices.getByCustomFieldMultiple(
      "employee_services",
      "shopId",
      shopId
    );

    let availableEmployee = [];

    for (const item of employeeList) {
      let empServiceArr = JSON.parse(item.services);

      for (const soloService of empServiceArr) {
        if (parseInt(soloService.subService) === parseInt(subServiceId)) {
          item.services = empServiceArr;
          availableEmployee.push(item);
        }
      }
    }

    let finalResult = [];

    for (const emp of availableEmployee) {
      let tempSlots = [];
      let employeeSlots = await commonServices.getByCustom2Field(
        "employee_slots",
        "empId",
        emp.userId,
        "shopId",
        shopId
      );

      let empTiminigs = null;
      for (const slot of employeeSlots) {
        if (slot.dates.includes(slotDate)) {
          empTiminigs = {
            start: slot.startTime,
            end: slot.endTime,
          };
          break;
        }
      }

      if (!empTiminigs) {
        return config.response(200, `No slot available!`, finalResult, res);
      }

      let timePeriod = calculateTimePeriod(empTiminigs.start, empTiminigs.end);

      let slotParts = Math.floor(timePeriod.hours / serviceTimePeriod);
      let slotStartTime = empTiminigs.start;

      for (let i = 0; i < slotParts; i++) {
        let slotEndTime = addHoursToTime(slotStartTime, serviceTimePeriod);
        if (!isTimeGreaterThan(currentTime, slotStartTime)) {
          let slotObj = {
            start: slotStartTime,
            end: slotEndTime,
          };
          tempSlots.push(slotObj);
        }

        slotStartTime = slotEndTime;
      }

      let slotInStr = Array.from(
        new Set(tempSlots.map((item) => JSON.stringify(item)))
      );
      tempSlots = slotInStr.map((item) => JSON.parse(item));

      let employeeDetails = await commonServices.getByCustomFieldSingle(
        "employee",
        "id",
        emp.userId
      );
      delete employeeDetails.password;
      delete employeeDetails.pPassword;

      employeeDetails.image = await config.getImageSingedUrlById(
        employeeDetails.file
      );

      let employeeObj = { ...employeeDetails, slots: tempSlots };

      finalResult.push(employeeObj);
    }

    return config.response(
      200,
      finalResult.length > 0
        ? "Slot list fetched successfully!"
        : "No slots available!",
      finalResult,
      res
    );
  } catch (error) {
    errorLog(error);
    return config.response(500, "Something went Wrong!", { error }, res);
  }
};


module.exports = shopController;
