#!/usr/bin/env python3
# Python Example - Create Multiple Floors for a Building

import requests

# Define floors to create (from basement to top)
floors = [
    {'floorNo': 'B1', 'name': 'Basement', 'sortOrder': -1},
    {'floorNo': 'G', 'name': 'Ground Floor', 'sortOrder': 0},
    {'floorNo': '1', 'name': 'First Floor', 'sortOrder': 1},
    {'floorNo': '2', 'name': 'Second Floor', 'sortOrder': 2}
]

headers = {'accessToken': 'YOUR_ACCESS_TOKEN'}

for floor in floors:
    params = {
        'extCommunityUuid': 'my-comm-001',
        'buildingNo': 'A1',
        **floor
    }

    response = requests.get(
        'http://api-cloud.thinmoo.net/sqFloor/extapi/add',
        params=params,
        headers=headers
    )

    result = response.json()
    if result['code'] == 0:
        print(f"✅ Created floor {floor['floorNo']}: {result['data']['uuid']}")
    else:
        print(f"❌ Error creating floor {floor['floorNo']}: {result['msg']}")
