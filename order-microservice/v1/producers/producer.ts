import ampq from "amqplib";

export async function publishOrderEvent(eventData: any, eventType: string) {
  const connection = await ampq.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "order-events";
  await channel.assertExchange(exchange, "fanout", { durable: false });
  const message = JSON.stringify({ eventType, data: eventData });
  channel.publish(exchange, "", Buffer.from(message));
  console.log(`Order event published: ${message}`);
  await channel.close();
  await connection.close();
}
