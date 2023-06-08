## Quantity takeoff for Doors Sample Workflow

Let's take the sample model and imagine that you would like to build a quantity takeoff for 'Doors'. 
You will need to get all design entities filtered by classification 'Doors'. 

To run the sample, please review [setup](./README.md#SETUP) instructions.

## Step 1: List all hubs

After login (top-right), click on `List Hubs` and take note of the hubId (`id`) [See NodeJs code](/services/aps/dx.js).

![Step 1](./images/hubs.png)

## Step 2: List all projects

Use the `hubId` from Step 1 and click `List Projects` to list all the projects within a Hub. Take note of the Project ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

![Step 2](./images/projects.png)


## Step 3: List Project Folders

Use the `projectId` from Step 2 and click `List Project Folders` to list all the folders in a Project. Take note of the Folder ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

![Step 3](./images/projectFolders.png)

## Step 4: List Folder Content

Use the `folderId` from Step 3 and click `List Folder Content` to list a folder and exchanges within a Project. Take note of the Exchange ID (`id`) for subsequent steps [See NodeJs code](/services/aps/dx.js).

![Step 4](./images/folderContent.png)

***Note:*** For the next step, we are interested in exchanges. 


## Step 5: Get Exchange information

Use the `exchangeId` from Step 4 and click `Get Exchange Information` to list the properties of a Data Exchange [See NodeJs code](/services/aps/dx.js).

![Step 5](./images/exchangeInfo2.png)


## Step 6: Generate quantity takeoff

Use the `exchangeId` and click on `Generate quantity takeoff`. You may adjust the `Category` field to get the filtered list of elements in an exchange [See NodeJs code](/services/aps/dx.js).

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
