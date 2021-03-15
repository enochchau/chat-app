// This is for if we wanted to authorize users before they went to the websocket;
// But we have to do validation anyways to make sure users are joining rooms they're allowed to join;
// so I guess it doesn't matter

    // server.on('upgrade', function upgrade(req, socket, head){
    //   const authError = () => {
    //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //     socket.destroy();
    //   }
    //   const pathname = new URL(req.url).pathname;
    //   if(pathname === "/chat"){
    //     const token = req.query["access_token"];
    //     if(!token){
    //       authError();
    //       return;
    //     } 
    //     const jwtUser = jwtToJwtUser(token);
    //     if(!jwtUser){
    //       authError();
    //       return;
    //     }
    //     wss.handleUpgrade(req, socket, head, function done(ws) {
    //       wss.emit('connection', ws, req);
    //     })
    //   }
    // })