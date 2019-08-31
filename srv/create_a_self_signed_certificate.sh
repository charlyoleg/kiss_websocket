#/usr/bin/bash

cd $(dirname $0)

### generate a self signed certificate
rm -fr ./kiss_websocket.key ./kiss_websocket.crt
openssl req -x509 -newkey rsa:4096 -sha256 -keyout ./kiss_websocket.key -out ./kiss_websocket.crt -days 365 -nodes -subj '/CN=localhost'

### view the certificate
#ls -la
#openssl x509 -in ./kiss_websocket.crt -text -noout


