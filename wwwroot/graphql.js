function registerOnClick(id, cb) {
    if (document.getElementById(id)) document.getElementById(id).onclick = cb;
}

registerOnClick('getHubs', async () => {
    let hubs = await query('/api/graphql/hubs');
    writeResponse(hubs)
});

registerOnClick('getProjects', async () => {
    let hubid = document.getElementById('hubId').value;
    if (hubid === '') { writeResponse('Please provide the HubId'); return; }
    let projects = await query('/api/graphql/hubs/' + hubid + '/projects');
    writeResponse(projects)
});

registerOnClick('getDesigns', async () => {
    let hubid = document.getElementById('hubId').value;
    let projectId = document.getElementById('projectId').value;
    if (hubid === '') { writeResponse('Please provide the HubId'); return; }
    if (projectId === '') { writeResponse('Please provide the ProjectId'); return; }
    let designs = await query('/api/graphql/hubs/' + hubid + '/projects/' + projectId + '/designs');
    writeResponse(designs)
});

// Sample 1 Design validation
registerOnClick('getFolders', async () => {
    let hubid = document.getElementById('hubId').value;
    let projectId = document.getElementById('projectId').value;
    if (hubid === '') { writeResponse('Please provide the HubId'); return; }
    if (projectId === '') { writeResponse('Please provide the ProjectId'); return; }
    let properties = await query('/api/graphql/hubs/' + hubid + '/projects/' + projectId + '/folders');
    writeResponse(properties)
});

registerOnClick('getFolderContent', async () => {
    let hubid = document.getElementById('hubId').value;
    let projectId = document.getElementById('projectId').value;
    let folderId = document.getElementById('folderId').value;
    if (hubid === '') { writeResponse('Please provide the HubId'); return; }
    if (projectId === '') { writeResponse('Please provide the ProjectId'); return; }
    if (folderId === '') { writeResponse('Please provide the Folder urn'); return; }
    let folderContent = await query('/api/graphql/hubs/' + hubid + '/projects/' + projectId + '/folders/' + folderId);
    writeResponse(folderContent)
});

registerOnClick('getExchangeInfo', async () => {
    let exchangeFileUrn = document.getElementById('exchangeFileUrn').value;
    if (exchangeFileUrn === '') { writeResponse('Please provide the exchange file urn'); return; }
    let exchangeInfo = await query('/api/graphql/exchange/' + exchangeFileUrn);
    writeResponse(exchangeInfo)
});

// Sample 2 Quantity Take off
registerOnClick('getTakeOff', async () => {
    let exchangeId = document.getElementById('exchangeId').value;
    let category = document.getElementById('category').value;
    if (exchangeId === '') { writeResponse('Please provide the exchangeId'); return; }
    if (category === '') { writeResponse('Please provide the category'); return; }
    let designEntities = await query('/api/graphql/exchange/' + exchangeId + '/takeoff/' + category);
    writeResponse(designEntities)
});

// Sample 3 Schedule
registerOnClick('getSchedule', async () => {
    let exchangeId = document.getElementById('exchangeId').value;
    let category = document.getElementById('category').value;
    if (exchangeId === '') { writeResponse('Please provide the exchangeId'); return; }
    if (category === '') { writeResponse('Please provide the category'); return; }
    let designEntities = await query('/api/graphql/exchange/' + exchangeId + '/takeoff/' + category + '/volumes');
    writeResponse(designEntities)
});

async function query(url) {
    writeResponse('Processing...');
    const resp = await fetch(url);
    if (resp.ok) {
        return await resp.json();
    }
    else if (resp.status == 401) {
        return resp.statusText + ' - Please login first';
    }
    else if (resp.status == 400)
        return resp.text();
    else
        return resp.statusText;
}

function writeResponse(response) {
    document.getElementById('jsonresult').innerText = JSON.stringify(response, null, 4)
}