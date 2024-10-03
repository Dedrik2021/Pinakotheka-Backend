export default function (socket, io) {
    //added new painting in db
	socket.on('newPainting', (newPainting) => {
        io.emit('get-paintings', newPainting)
    })

    //added product in cart
	socket.on('newProduct', (newProduct) => {
        const userId = newProduct.userId;
        io.emit(`get-products/${userId}`, newProduct)
    })

    //send message to other user
	socket.on('send-message', (newMessage) => {
        const userId = newMessage.userId;
        const authorId = newMessage.authorId;
        io.emit(`get-messages-by-user-and-author-id/${userId}/${authorId}`, newMessage)
    })

    //typing
    socket.on('typing', (conversation) => {
        socket.in(conversation).emit('typing')
    })

    //stop typing
    socket.on('stop-typing', (conversation) => { 
        socket.in(conversation).emit('typing')
    })
}