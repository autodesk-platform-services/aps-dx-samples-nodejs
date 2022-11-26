var axios = require('axios');

const BASE_URL = 'https://developer.api.autodesk.com/dataexchange/2022-11/graphql';


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
    const query = ` {
            project(
                        hubId: "${hubId}"
                        projectId: "${projectId}"
                ) {
                    id
                    name
                    folders {
                        results {
                            id
                            name
                            items {
                                results {
                                    id
                                    name
                                    __typename
                                    ... on BasicFile {
                                            name
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

async function getFolderContent(hubId, projectId, folderId, token) {
    const query = ` {
                items(
                  projectId: "${projectId}"
                  itemId: "${folderId}"
                  hubId: "${hubId}"
                ) {
                  results {
                    id
                    name
                    extensionType
                   }
                 }
           }
      `;

    return APS_GraphQL(token, query);
}


async function getExchangeInfo(exchangeFileUrn, token) {
    const query = ` {
                exchanges(filter: { exchangeFile: "${exchangeFileUrn}" }) {
                  results {
                    id
                    name
                    versions{
                        results{
                            id
                            createdOn
                        }
                    }
                    propertyGroups {
                            results {
                                name
                                id
                                properties{
                                    results{
                                        name
                                        value
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

async function getDataByCategory(exchangeId, category, token) {
    const query = ` {
            designEntities(
                    filter: {
                        exchangeId: "${exchangeId}", 
                        classificationFilter: {category: "${category}"}}
            ) {
               results {
                 id
                 name
                 classification {
                   category
                 }
                  properties{
                    results {
                        name
                        displayValue
                        value
                    propertyDefinition {
                       description
                       specification
                       type
                       units
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
    const query = ` {
            designEntities(
                    filter: {
                        exchangeId: "${exchangeId}", 
                        classificationFilter: {category: "${category}"}}
            ) {
               results {
                 id
                 name
                 classification {
                   category
                 }
                  properties (filter: {name:"Volume" }){
                    results {
                        name
                        displayValue
                        value
                    propertyDefinition {
                       description
                       specification
                       type
                       units
                       }
                     }
                   }
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
    getExchangeInfo,
    getDataByCategory,
    getVolumeDataByCategory
};
