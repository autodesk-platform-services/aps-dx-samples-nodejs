## Retrieving the Exchange Item Information.

In order to explore the data of a Data Exchange, it is necessary to obtain the exchange ID, which can be retrieved from the exchange item located in ACC. The following code sample focuses on the specific part of the Data Exchange GraphQL API that is needed to navigate through hubs, projects, and folders, and identify the exchange item:

To run the sample, please review [setup](./README.md#SETUP) instructions.

## Step 1: List all hubs

After login (top-right), click on `List Hubs` and take note of the hubId (`id`). [See NodeJs code](/services/aps/dx.js). 

![Step 1](./images/hubs.png)

Query used:

```
{
    hubs {
        results {
                name
                id
        }
    }
}
```

## Step 2: List all projects

Use the `hubId` from Step 1 and click `List Projects` to list all the projects within a Hub. Take note of the Project ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

![Step 2](./images/projects.png)

Query used:

```
{
    projects (hubId: "b.768ca****4e48") {
        results {
            name
            id
        }
    }
}
```

## Step 3: List Project Folders

Use the `projectId` from Step 2 and click `List Project Folders` to list all the folders in a Project. Take note of the Folder ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

![Step 3](./images/projectFolders.png)

Query used:

```
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
```

***Note:*** In this request response contains the folders and exchanges within a project.


## Step 4: List Folder Content

Use the `folderId` from Step 3 and click `List Folder Content` to list a folder and exchanges within a Project. Take note of the Exchange ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

***Note:*** This query returns the folders and exchanges within the folder.

![Step 4](./images/folderContent.png)

Query used:

```
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
      }
    }
``` 

## Step 5a: Get Exchange information

Use the `exchangeId` from Step 4 and click `Get Exchange Information` to list the properties of a Data Exchange [See NodeJs code](/services/aps/dx.js).

![Step 5a](./images/exchangeInfo.png)

Query used:

```
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
      properties {
        results {
          name
          value
        }
      }
    }
  }
``` 

## Step 5b: Get Exchange information by exchangeFileUrn
Alternatively, use the exchange `fileUrn` from Step 4 and click `Get Exchange Information` to list the properties of a Data Exchange

![Step 5a](./images/exchangeInfo.png)

```
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
        properties {
          results {
            name
            value
          }
        }
      }
    }
```

> **Note**: Once exchangeId is retrived from above steps, we will use this exchangeId for the further process.
