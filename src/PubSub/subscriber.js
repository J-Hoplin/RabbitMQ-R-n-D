const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const consumer = async () => {
  try {
    console.log("Make connection")

    // Connect to MQ Server
    const connection = await amqp.connect(MQURL);

    // Create Channel
    const channel = await connection.createChannel();

    await channel.assertExchange(process.env.EXCHANGE_NAME, 'fanout', {
      durable: false
    })

    const qinstance = await channel.assertQueue('', {
      exclusive: true
    })

    channel.bindQueue(qinstance.queue, process.env.EXCHANGE_NAME, '')

    channel.consume(qinstance.queue, (msg) => {
      console.log(msg.content.toString())
    })

    // channel.assertQueue('')

  } catch (err) {
    console.error(err.message)
  }
}

consumer()