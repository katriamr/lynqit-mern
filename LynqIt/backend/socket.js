import User from "./models/user.model.js"

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('identity', async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          socketId: socket.id, isOnline: true
        }, { new: true })
      } catch (error) {
        console.log(error)
      }
    })


    socket.on('updateLocation', async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          isOnline: true,
          socketId: socket.id
        })

        if (user && user.role === 'deliveryBoy') {
          // Find all orders where this delivery boy is assigned and emit to customers
          const DeliveryAssignment = (await import('./models/deliveryAssignment.model.js')).default
          const assignments = await DeliveryAssignment.find({
            assignedTo: userId,
            status: 'assigned'
          }).populate('order')

          assignments.forEach(assignment => {
            const customerSocketId = assignment.order.user.socketId
            if (customerSocketId) {
              io.to(customerSocketId).emit('updateDeliveryLocation', {
                deliveryBoyId: userId,
                latitude,
                longitude
              })
            }
          })
        }


      } catch (error) {
          console.log('updateDeliveryLocation error', error)
      }
    })




    socket.on('disconnect', async () => {
      try {

        await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          isOnline: false
        })
      } catch (error) {
        console.log(error)
      }

    })
  })
}