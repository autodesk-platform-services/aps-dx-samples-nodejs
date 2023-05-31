## Quantity takeoff for Doors Sample Workflow

Let's take the sample model and imagine that you would like to build a quantity takeoff for 'Doors'. 
You will need to get all design entities filtered by classification 'Doors'. 

To run the sample, please review [setup](./README.md#SETUP) instructions.

## Step 1: List all hubs

After login (top-right), click on `List Hubs` and take note of the hubId (`id`). [See NodeJs code](/services/aps/dx.js).

![Step 1](./images/hubs.png)

## Step 2: List all projects

Use the `HubId` from step 1 to list all projects and take note of the projectId (`id`). [See NodeJs code](/services/aps/dx.js).

![Step 2](./images/projects.png)


## Step 3: List Project Folders

This step uses `projectId`. Click on List Project Folders. [See NodeJs code](/services/aps/dx.js).

![Step 3](./images/projectFolders.png)

## Step 4: List Folder Content

This step uses `folderId`. Click on List Folders Content. [See NodeJs code](/services/aps/dx.js).

![Step 4](./images/folderContent.png)

***Note:*** For the next step, we are interested in exchanges. 


## Step 5: Get Exchange information

This step uses only the `exchangeId` received from the previous results. Click on Get Exchange Information. [See NodeJs code](/services/aps/dx.js).

![Step 5](./images/exchangeInfo2.png)


## Step 6: Generate quantity takeoff

Use the `exchangeId` and click on generate quantity takeoff. You may adjust the `Category` field. [See NodeJs code](/services/aps/dx.js).

![Step 6](./images/takeoff.png)

GraphQL query used:

```
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
                  valueType
                  units
                }
              }
            }
          }
        }
      }
    }
```
