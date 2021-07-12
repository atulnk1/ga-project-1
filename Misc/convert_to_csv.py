import pandas as pd

with open('bus_stop.json', encoding='utf-8-sig') as bs_input:
    df = pd.read_json(bs_input)

df.to_csv('busStopsLong.csv', encoding='utf-8', index=False)