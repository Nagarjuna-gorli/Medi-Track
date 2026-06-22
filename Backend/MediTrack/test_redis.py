import redis

r = redis.Redis(host="127.0.0.1", port=6379)

print("PING:", r.ping())
print("SET:", r.set("test", "hello"))
print("GET:", r.get("test"))