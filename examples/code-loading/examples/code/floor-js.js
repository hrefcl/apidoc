// JavaScript Example - Add Basement Floor

const response = await fetch(
  'http://api-cloud.thinmoo.net/sqFloor/extapi/add?' + new URLSearchParams({
    extCommunityUuid: 'my-comm-001',
    buildingNo: 'A1',
    floorNo: 'B1',
    name: 'Basement Level 1',
    sortOrder: '-1'
  }),
  { headers: { 'accessToken': 'YOUR_ACCESS_TOKEN' } }
);

const result = await response.json();
console.log('Floor created with ID:', result.data.id);
console.log('Floor UUID:', result.data.uuid);
