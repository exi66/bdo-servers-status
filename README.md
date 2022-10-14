# bdo-servers-status
Down detector for Black Desert Online

## overview
The default settings are for the RU region, but you can change them in `/data/servers.json`. To find out the IP of the servers, you need to open the resource monitor from Microsoft, go to the network tab and go to the tcp-connections, then find:  
- port 8889 - this will be the address of the game server 
- port 8888 - authorization server. Can be found at the channel selection stage  
- port 443  - central market 
<!-- -->
Other game services can be found in the same way. Just take an action that requires an obvious connection to the service you are interested in (for example, open an AoS window or search for matchmaking) and look in the resource monitor to which address and port the last packet was sent.

## run
- `npm install`
- `npm start`
