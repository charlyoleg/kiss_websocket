#!/usr/bin/env python

"""
client_requests_only.py
a small python client using only requests (no socketio involved)
"""

import requests
import logging
import time
import json


##########################################################
# logging
##########################################################

### remove urllib3 warnings about self-certificate
requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)

### logger
logging.getLogger('urllib3').setLevel(logging.INFO)
logger = logging.getLogger('')
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())


##########################################################
# sub-function
##########################################################

def get_group_result():
  "requests GET on group_result"
  r = requests.get('https://localhost:8007/group_result', verify=False)
  if (r.status_code == 200):
    logger.info('group_result: {:d}'.format(r.json()['total']))
  else:
    logger.error('ERR027: Error by GET /group_result')

def post_contribute(point):
  "requests POST on /contribute"
  payload_json = {"contrib": "{:d}".format(point)}
  r = requests.post('https://localhost:8007/contribute', json=payload_json, verify=False)
  if (r.status_code == 200):
    #print(r.text)
    logger.info('new total: {:d}'.format(r.json()['total']))
  else:
    logger.error('ERR027: Error by POST /contrib')


##########################################################
# main
##########################################################

### Hello
logger.info("client_requests_only.py says Hello!")

### requests sequence
get_group_result()
post_contribute(5)
post_contribute(9)
get_group_result()

### Bye
time.sleep(0.5)
logger.info("client_requests_only.py says Bye!")

