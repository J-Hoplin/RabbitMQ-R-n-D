const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const subscriber = async () => {
  try {
    console.log("Make connection")

    // Create connection
    const connection = await amqp.connect(MQURL)

    // Create Channel
    const channel = await connection.createChannel()

    // Create Exchange
    // Exchange to be 'direct' type
    await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', {
      durable: false
    })

    const randomChannel = await channel.assertQueue('', {
      exclusive: true
    })

    const log_levels = ["info", "error", "warn"]
    log_levels.forEach(async (x) => {
      await channel.bindQueue(randomChannel.queue, process.env.EXCHANGE_NAME, x)
    })

    await channel.consume(randomChannel.queue, (msg) => {
      console.log(`[x] Msg send - ${msg.fields.routingKey} : ${msg.content.toString()}`)
    }, {
      noAck: true
    })
  } catch (err) {
    console.error(err)
  }
}

subscriber()