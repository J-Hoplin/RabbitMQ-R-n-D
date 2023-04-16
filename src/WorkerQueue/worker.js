const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const consumer = async () => {
  try {
    // Connect to MQ Server
    const connection = await amqp.connect(MQURL)

    // Create Channel
    const channel = await connection.createChannel()

    // Declare a Queue to send message
    await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: true
    })

    await channel.consume(process.env.QUEUE_NAME, (msg) => {
      const seconds = msg.content.toString().split('.').length - 1
      console.log(`Recieved : ${msg.content.toString()}`)
    }, {
      noAck: true
    })

  } catch (err) {
    console.error(err.message)
  }
}

consumer()