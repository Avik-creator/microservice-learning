import amqp from "amqplib";

export async function publishProductEvent(eventData: any, eventType: string) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "product-events";
  await channel.assertExchange(exchange, "fanout", { durable: false });
  const message = JSON.stringify({ eventType, data: eventData });
  channel.publish(exchange, eventType, Buffer.from(message));
  console.log(`Product event published: ${message}`);
  await channel.close();
  await connection.close();
}
