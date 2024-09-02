export default function (socket, io) {
	socket.on('newPainting', (newPainting) => {
        io.emit('get-paintings', newPainting)
    })

	socket.on('newProduct', (newProduct) => {
        const userId = newProduct.userId;
        io.emit(`get-products/${userId}`, newProduct)
    })

	socket.on('send-message', (newMessage) => {
        const userId = newMessage.userId;
        const authorId = newMessage.authorId;
        io.emit(`get-messages-by-user-and-author-id/${userId}/${authorId}`, newMessage)
    })
}