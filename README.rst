=======================
Notes on kiss_websocket
=======================


Presentation
============

*kiss_websocket* is a small sandbox project to play with WebSocket_.

.. _WebSocket : https://en.wikipedia.org/wiki/WebSocket


It contains the client side and the server side.


Topology
========

Servers
-------

This repo contains one WebSocket server in the directory *srv*. It is implemented with *nodejs* and the npm package ws_

.. _ws : https://www.npmjs.com/package/ws


Clients
-------

This repo contains three clients that consumes the WebSocket service:

- web : it uses the WebSocket service from the browser (WebSocket_API_)
- client_js : it uses the WebSocket service from a nodejs-application based on the package ws_
- client_py : it uses the WebSocket service from a python-application based on the package websockets_

.. _WebSocket_API : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
.. _websockets : https://websockets.readthedocs.io/



