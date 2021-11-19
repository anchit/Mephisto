import os
from glob import iglob
import json
path = "/private/home/anchit/Mephisto/data/data/runs/NO_PROJECT/6/**/agent_data.json"

file_list = [f for f in iglob(path, recursive=True) if os.path.isfile(f) and 'onboarding' not in f]
count = 0
scam = 0
for f in file_list:
    data = json.load(open(f,'r'))
    if data['outputs'] is not None:
        count+=1
        if 'pointed' in data['outputs']['final_data']['question'].lower():
            scam +=1
        data['outputs']['final_data']['topic'] = data['inputs']['topic']
        print(data['outputs']['final_data'])

print(count)
print(scam)

