import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";
const prisma = new PrismaClient();

export async function consumeProductEvents(eventType: string) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "order-events";
  await channel.assertExchange(exchange, "fanout", { durable: false });
  await channel.assertQueue("product-queue", { exclusive: false });
  await channel.bindQueue("product-queue", exchange, eventType);
  console.log(`Product consumer is waiting for messages.......`);

  channel.consume(
    "product-queue",
    async message => {
      if (message) {
        const event = JSON.parse(message.content.toString());
        console.log(`Product event received: ${event.eventType}`);
        handleEvent(event);
      }
    },
    { noAck: true }
  );
  console.log(`Product consumer is waiting for messages`);
}

async function handleEvent(event: any) {
  switch (event.eventType) {
    case "ORDER_PLACED":
      console.log("Order placed event received");
      const items = event.data.items;
      items.forEach(async (item: any) => {
        try {
          const product = await prisma.product.findUnique({
            where: {
              id: item.productId,
            },
          });
          if (product) {
            await prisma.product.update({
              where: {
                id: item.productId,
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        } catch (error) {
          console.error(error);
        }
      });
      break;
    default:
      console.log("Event type not found");
  }
}
