#!/bin/bash
# cURL Example - Add Ground Floor

curl -X GET "http://api-cloud.thinmoo.net/sqFloor/extapi/add?extCommunityUuid=my-comm-001&buildingNo=A1&floorNo=G&name=Ground%20Floor&sortOrder=0" \
  -H "accessToken: YOUR_ACCESS_TOKEN"
