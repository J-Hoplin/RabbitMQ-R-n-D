const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const producer = async () => {
  try {
    const msg = process.argv.slice(2).join(' ') || "Default Message"
    console.log("Make connection")

    // Connect to MQ Server
    const connection = await amqp.connect(MQURL);

    // Create Channel
    const channel = await connection.createChannel()

    // console.log("Connect to Queue")
    // // Create Exchange

    // Create Exchange
    console.log("Assert Exchange")
    channel.assertExchange(process.env.EXCHANGE_NAME, 'fanout', {
      durable: false
    })

    console.log("Send message to named exchange")
    channel.publish(process.env.EXCHANGE_NAME, '', Buffer.from(msg))
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (err) {
    console.error(err.message)
  }
}

producer()