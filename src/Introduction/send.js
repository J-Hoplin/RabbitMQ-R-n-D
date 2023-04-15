const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const producer = async (msg) => {
  try {
    console.log('Make connection')

    // Connect to MQ Server
    const connection = await amqp.connect(MQURL)

    // Create Channel
    const channel = await connection.createChannel()

    // Create Queue
    await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: false
    })

    console.log(`Send message to MQ : ${msg}`)

    channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(msg))
    setTimeout(() => {
      connection.close();
    }, 1000)
  } catch (err) {
    console.error(err.message)
  }
}

producer("Hello")