#!/bin/bash
# cURL Example - Add Numeric Floor (First Floor)

curl -X GET "http://api-cloud.thinmoo.net/sqFloor/extapi/add?extCommunityUuid=my-comm-001&buildingNo=A1&floorNo=1&name=First%20Floor&sortOrder=1" \
  -H "accessToken: YOUR_ACCESS_TOKEN"
