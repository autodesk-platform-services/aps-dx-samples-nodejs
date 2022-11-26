## Window Schedule Sample Workflow

A schedule is typically used to identify, in most cases a chart or table providing descriptions of the windows , doors, finishes, lintels, footings, piers, etc. on a construction project. Let's take the same sample model and imagine that you would like to build a window schedule. You will need to retrieve properties like panel glazing, glass, frame material, height, width, etc. of all design entity instances of category windows.

To run the sample, please review [setup](./README.md#SETUP) instructions.

## Step 1: List all hubs

After login (top-right), click on `List Hubs` and take note of the hubId (`id`). [See NodeJs code](/services/aps/dx.js).

![Step 1](./images/hubs.png)

## Step 2: List all projects

Use the `HubId` from step 1 to list all projects and take note of the projectId (`id`). [See NodeJs code](/services/aps/dx.js).

![Step 2](./images/projects.png)


## Step 3: List Project Folders

This step uses `hubId` and `projectId`. Click on List Project Folders. [See NodeJs code](/services/aps/dx.js).

![Step 3](./images/projectFolders.png)

***Note:*** In this request we show not only the main folders like *Project Files* and *For the Field*,
but also the sub-folders.


## Step 4: List Folder Content

This step uses `hubId`, `projectId` and the `folderId`. Click on List Folders Content. [See NodeJs code](/services/aps/dx.js).

***Note:*** In case there are sub-folders needed to be explored,
put the sub-folder urn into same filed and rerun again this step

![Step 4](./images/folderContent.png)

***Note:*** For the next step, we are interested in items of type `"items:autodesk.bim360:FDX"`.


## Step 5: Get Exchange information

This step uses only the `exchangeFileUrn` received from the previous results. Click on Get Exchange Information. [See NodeJs code](/services/aps/dx.js).

![Step 5](./images/exchangeInfo2.png)

## Step 6: Generate quantity takeoff

Use the `exchangeId` from step 5. Click on generate schedule. You may adjust he `Category` field. [See NodeJs code](/services/aps/dx.js) 

![Step 6](./images/schedule.png)

Query used:

```
{
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
```
***Note:*** For now, the only filter available is [the name of the property](https://forge.autodesk.com/en/docs/fdxgraph/v1/reference/inputs/propertyfilterinput/), as in above query is the "Volume".
