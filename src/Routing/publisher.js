const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config()
const MQURL = `amqp://${process.env.MQ_NAME}:${process.env.MQ_PASSWORD}@localhost:5672`

const publisher = async () => {
  const args = process.argv.slice(2);
  const msg = args.slice(1).join(' ') || "Example Message";
  const severity = (args.length > 0) ? args[0] : "info"
  console.log(severity)
  console.log("Make connection")
  const connection = await amqp.connect(MQURL)
  try {
    const channel = await connection.createChannel()

    await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', {
      durable: false
    })

    channel.publish(process.env.EXCHANGE_NAME, severity, Buffer.from(msg))
    console.log(`[x] Sent ${severity} : ${msg}`)
    setTimeout(() => {
      connection.close()
    }, 500)
  } catch (err) {
    connection.close()
    console.error(err)
  }
}

publisher()