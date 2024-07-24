export default function (socket, io) {
	socket.on('newPainting', (newPainting) => {
        io.emit('get-paintings', newPainting)
    })
}