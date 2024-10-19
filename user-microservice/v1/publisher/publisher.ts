import amqp from "amqplib";

export async function publishUserEvent(event: any, eventType: string) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "user-events";
  await channel.assertExchange(exchange, "direct", { durable: false });
  const message = JSON.stringify({ eventType, data: event });
  channel.publish(exchange, eventType, Buffer.from(message));
  console.log(`User event published: ${message}`);
  await channel.close();
  await connection.close();
}
