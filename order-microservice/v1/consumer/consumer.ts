import ampq from "amqplib";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function orderConsumerEvent(eventType: string) {
  const connection = await ampq.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "user-events";
  await channel.assertExchange(exchange, "direct", { durable: false });
  await channel.assertQueue("order-queue", { exclusive: false });

  await channel.bindQueue("order-queue", exchange, eventType);
  channel.consume("order-queue", message => {
    if (message) {
      const event = JSON.parse(message.content.toString());
      console.log(`Order event received: ${event.eventType}`);
      handleOrderEvent(event);

      channel.ack(message);
    }
  });
  console.log(`Order consumer is waiting for messages`);
}

async function handleOrderEvent(event: any) {
  switch (event.eventType) {
    case "USER_REGISTERED":
      console.log("User registered event received");
      break;
    case "USER_PROFILE_UPDATED":
      const order = await prisma.order.findFirst({
        where: {
          userId: event.data.userId,
        },
      });

      if (order) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            shippingAddress: event.data.shippingAddress,
            pincode: event.data.pincode,
            phoneNumber: event.data.phoneNumber,
            city: event.data.city,
            country: event.data.country,
          },
        });
      }
      break;
    default:
      console.log("Event type not found");
  }
}
