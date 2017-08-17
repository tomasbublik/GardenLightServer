# Garden Lights Controller Server

A simple Node.js based rest server running on Raspberry Pi (or potentially any Linux machine) to control the relay in order to turn on or off the garden lights.
The server is running on port 3000 and supposes the underlying system to have the following system commands aliases:

./on - to enable the relay switch through GPIO
./off - to disable the relay switch through GPIO
./state - to obtain the current relay state
./hostname - to obtain the system network hostname


Two version are supported. If you have Node.js 8 with async/await features, run:

```javascript
node server.js
```

For older versions of Node.js run:

```javascript
node server.js
```

