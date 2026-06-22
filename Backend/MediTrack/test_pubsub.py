import asyncio
import redis.asyncio as redis

async def main():
    r = redis.Redis(host="127.0.0.1", port=6379)

    pubsub = r.pubsub()

    await pubsub.subscribe("test")

    print("Subscribed")

    while True:
        msg = await pubsub.get_message(
            ignore_subscribe_messages=True,
            timeout=1
        )

        if msg:
            print(msg)

        await asyncio.sleep(1)

asyncio.run(main())