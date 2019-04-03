function createExchange
{
    curl --silent -i -u ${RABBITMQ_USER}:${RABBITMQ_PASS} -H "content-type:application/json" \
        -X PUT -d'{"type":"topic","durable":true}' \
        http://rabbitmq:15672/api/exchanges/%2f/$1
}

createExchange 'business-partner'

while [ $? -ne 0 ]; do
    sleep 1
    echo 'Could not create RabbitMQ exhange. Retrying...'
    createExchange 'business-partner'
done
