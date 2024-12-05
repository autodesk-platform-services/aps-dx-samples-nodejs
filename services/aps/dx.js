var axios = require('axios');

const BASE_URL = 'https://developer.api.autodesk.com/dataexchange/2023-05/graphql';


async function APS_GraphQL(token, query) {
    return axios({
        url: BASE_URL,
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/graphql'
        },
        data: query
    })
        .then(result => {
            return result.data.data ? result.data.data : "Error: make sure that you provided right input data (e.g. urn of the FDX item and not of a Revit file)"
        });
}

async function APS_GraphQLMutation(token, mutation) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://developer.api.autodesk.com/dataexchange/2023-05/graphql',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.access_token,
        },
        data : mutation
    };



    return axios.request(config)
        .then(result => {
            return result.data.data ? result.data.data : "Error: make sure that you provided right input data (e.g. urn of the FDX item and not of a Revit file)"
        });
}

async function getHubs(token) {

    const query = `
      {
        hubs {
            results {
                    name
                    id
            }
        }
      }
      `;

    return APS_GraphQL(token, query);
}


async function getProjects(hubId, token) {
    const query = `{
        projects (hubId: "${hubId}") {
            results {
                name
                id
            }
        }
      }
      `;
    return APS_GraphQL(token, query);
}


async function getFolders(hubId, projectId, token) {
    const query = `
    {
      project(projectId: "${projectId}") {
        id
        name
        folders {
          results {
            id
            name
            __typename
    
            folders {
                results {
                    id
                    name
                    __typename
                }
            }
            exchanges {
                results {
                    id
                    name
                    __typename
                }
            }
          }
        }
      }
    }
  `;
    return APS_GraphQL(token, query);
}

async function getFolderContent(hubId, projectId, folderId, token) {
    const query = `
    {
      folder(folderId: "${folderId}") {
        id
        name
        folders {
          results {
            id
            name
            __typename
          }
        }
        exchanges {
          results {
            id
            name
            alternativeRepresentations {
              fileUrn
              fileVersionUrn
            }
            __typename
          }
        }
        items {
            results{
                id
                name
            }
        }
      }
    }
  `;

    return APS_GraphQL(token, query);
}

async function getExchangeInfoById(exchangeId, token) {

    const query = `
  {
    exchange(exchangeId: "${exchangeId}") {
      id
      name
      version {
        versionNumber
      }
      alternativeRepresentations {
        fileUrn
        fileVersionUrn
      }
      lineage {
        versions {
          results {
            id
            versionNumber
            createdOn
          }
        }
        tipVersion {
          versionNumber
        }
      }
      propertyDefinitions {
          results {
              id
              name
              specification
        }
      }
    }
  }  
  `;
    return APS_GraphQL(token, query);
}

async function getExchangeInfo(exchangeFileUrn, token) {
    const query = `
    {
      exchangeByFileId(exchangeFileId: "${exchangeFileUrn}") {
        id
        name
        version {
          versionNumber
        }
        lineage {
          versions {
            results {
              id
              versionNumber
              createdOn
            }
          }
          tipVersion {
            versionNumber
          }
        }
        propertyDefinitions {
          results {
              id
              name
              specification
          }
       }
      }
    }
  `;

    return APS_GraphQL(token, query);
}

async function getDataByCategory(exchangeId, category, token) {
    const query = `
    {
      exchange(exchangeId: "${exchangeId}") {
        id
        name
        version {
          versionNumber
        }
        elements(filter: {query: "property.name.category=='${category}'"}) {
          results {
            id
            name
            properties {
              results {
                name
                value
                propertyDefinition {
                  description
                  specification
                  units
                }
              }
            }
          }
        }
      }
    }
  `;

    return APS_GraphQL(token, query);
}

async function getVolumeDataByCategory(exchangeId, category, token) {
    const query = `
    {
      exchange(exchangeId: "${exchangeId}") {
        id
        name
        version {
          versionNumber
        }
        elements(filter: {query: "property.name.category=='${category}'"}) {
          results {
            id
            name
            properties(filter: {names: ["Volume", "category"]}) {
              results {
                name
                value
                propertyDefinition {
                  description
                  specification
                  id
                  units
                }
              }
            }
          }
        }
      }
    }
  `;

    return APS_GraphQL(token, query);
}

async function createDataExchangeForRevit(revit_file_id, view_name, folder_id, exchange_name, token) {
  //   const mutation = `
  //   {
  //         createExchange(
  //           input: {
  //               viewName: "${view_name}"
  //               source: {
  //                   fileId: "${revit_file_id}"
  //               }
  //               target: {
  //                   name: "${exchange_name}"
  //                   folderId: "${folder_id}"
  //               }
  //           }
  //         ) {
  //               exchange {
  //                   id
  //                   name
  //               }
  //           }
  //   }
  // `;


    const data = JSON.stringify({
        query: `mutation CreateExchangeFromRevit {
                        createExchange(
                            input: {
                                viewName: "${view_name}",
                                source: {
                                    fileId: "${revit_file_id}"
                                }
                                target: {
                                    name: "${exchange_name}"
                                    folderId: "${folder_id}"
                                }
                            }
                        ) {
                                exchange {
                                    id
                                    name
                                }
                            }
        }`,
        variables: {}
    });


    return APS_GraphQLMutation(token, data);
}


async function getStatusOfExchange(exchangeId,token) {
    const query = `
    {
      getExchangeCreationStatus(exchangeId: "${exchangeId}") {
                exchange{
                   name
                }
                status
                versionNumber
                exchange{
                    id
                    name
                }

      }
    }
  `;

    return APS_GraphQL(token, query);
}

module.exports = {
    getHubs,
    getProjects,
    getFolders,
    getFolderContent,
    getExchangeInfoById,
    getExchangeInfo,
    getDataByCategory,
    getVolumeDataByCategory,
    createDataExchangeForRevit,
    getStatusOfExchange
};
