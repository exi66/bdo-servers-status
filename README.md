# bdo-servers-status
Down detector for Black Desert Online

## overview
The default settings are for the RU region, but you can change them in `/storage/servers.json`. To find out the IP of the servers, you need to open the resource monitor from Microsoft, go to the network tab and go to the tcp-connections, then find:  
- port 8889 - this will be the address of the game server 
- port 8888 - authorization server. Can be found at the channel selection stage  
- port 443  - central market 
<!-- -->
Other game services can be found in the same way. Just take an action that requires an obvious connection to the service you are interested in (for example, open an AoS window or search for matchmaking) and look in the resource monitor to which address and port the last packet was sent.

## run
- `npm install`
- `npm start`

## How it works
### Technical side
The application sends an ICMP echo packet without any body, which means that this packet does not reach the game server directly, as it is not a game packet, i.e. actually displayed and collected statistics is the latency of the network gateway of the game servers.  
After reading, there may be a suspicion that the application clogs (like DDoS) the channel of the game servers, but this is not so. Firstly, the application packets, as described above, do not cause any calculations on the game servers, and secondly, ping packets are sent every 5 minutes (every minute if any of the servers went down), which is very small, for comparison, pvp in some arena you send and receive about 30-60 packets every second that require calculation by the server.
