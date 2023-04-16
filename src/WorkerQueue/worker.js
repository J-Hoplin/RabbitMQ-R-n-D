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

    // Fair Prefetch
    channel.prefetch(1);

    // Declare a Queue to send message
    await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: true
    })

    channel.consume(process.env.QUEUE_NAME, (msg) => {
      const seconds = msg.content.toString().split('.').length - 1
      console.log(`Recieved : ${msg.content.toString()}`)
      setTimeout(() => {
        console.log("Done!")
        // 중요!
        // 처리를 완료하였다는 ACK Message를 Rabbit MQ에 전송하여 Queue에서 메세지 삭제
        channel.ack(msg)
      },seconds * 1000);
    }, {
      noAck: false
    })

  } catch (err) {
    console.error(err.message)
  }
}

consumer()