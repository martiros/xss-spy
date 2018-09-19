
function setupSocketListeners(io) {


  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('data', function(data){
      io.emit('data', data);
    });

    socket.on('execute-js', function(data){
      io.emit('execute-js', data);
    });
  });

}

module.exports = setupSocketListeners;
