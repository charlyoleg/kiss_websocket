#!/usr/bin/env python

"""
client.py
a small python socketio client
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
#logger.setLevel(logging.NOTSET)
logger.addHandler(logging.StreamHandler())


##########################################################
# WebSocket registration
##########################################################


#def on_update_result(event_data):
#  logger.info('client gets event on_update_result')
#  #logger.debug(data)
#  one_total = event_data['total']
#  logger.info('Update result to {:.02f}'.format(one_total))
#
#def on_connect():
#  logger.info("client_py connected!")
#
#def on_disconnect():
#  logger.info("client_py disconnected!")
#
#def on_reconnect():
#  logger.info('client_pyreconnect')
#
#
#### let's start
#socket_io = SocketIO('https://127.0.0.1', 8005, LoggingNamespace, verify=False)
#socket_io.on('connect', on_connect)
#socket_io.on('disconnect', on_disconnect)
#socket_io.on('reconnect', on_reconnect)
## real stuff
#socket_io.on('update result', on_update_result)
#
## wait a bit to check whats happen
#time.sleep(1.0)
##payload_json = {"contrib": "2"}
##socket_io.emit('one more contribution', payload_json);
#socket_io.wait(seconds=1)


##########################################################
# sub-function
##########################################################

def get_group_result():
  "requests GET on group_result"
  r = requests.get('https://localhost:8007/group_result', verify=False)
  if (r.status_code == 200):
    logger.info('GET info: group_result: {:d}'.format(r.json()['total']))
  else:
    logger.error('ERR027: Error by GET /group_result')

def post_contribute(point):
  "requests POST on /contribute"
  payload_json = {"contrib": "{:d}".format(point)}
  r = requests.post('https://localhost:8007/contribute', json=payload_json, verify=False)
  if (r.status_code == 200):
    #print(r.text)
    logger.info('POST info: new total: {:d}'.format(r.json()['total']))
    #socket_io.emit('one more contribution', payload_json);
    #socket_io.wait(seconds=1) # ease the event handling
  else:
    logger.error('ERR027: Error by POST /contrib')


##########################################################
# main
##########################################################

### Hello
logger.info("client.py says Hello!")

### requests sequence
get_group_result()
post_contribute(5)
post_contribute(9)
get_group_result()

### Bye
time.sleep(0.5)
#socket_io.wait(seconds=1) # ensure all events are handled
logger.info("client.py says Bye!")

