putConsulData()
{
  curl -X PUT -d ${MYSQL_DATABASE} http://consul:8500/v1/kv/business-partner/db-init/database &&
  curl -X PUT -d 'root' http://consul:8500/v1/kv/business-partner/db-init/user &&
  curl -X PUT -d ${MYSQL_ROOT_PASSWORD} http://consul:8500/v1/kv/business-partner/db-init/password &&
  curl -X PUT -d 'true' http://consul:8500/v1/kv/business-partner/db-init/populate-test-data &&
  curl -X PUT -d ${REDIS_AUTH} http://consul:8500/v1/kv/business-partner/redis/password &&
  curl -X PUT -d 'svc_business-partner' http://consul:8500/v1/kv/business-partner/service-client/username &&
  curl -X PUT -d 'test' http://consul:8500/v1/kv/business-partner/service-client/password &&
  curl -X PUT -d 'oidcCLIENT' http://consul:8500/v1/kv/business-partner/service-client/client-key &&
  curl -X PUT -d '91c0fabd17a9db3cfe53f28a10728e39b7724e234ecd78dba1fb05b909fb4ed98c476afc50a634d52808ad3cb2ea744bc8c3b45b7149ec459b5c416a6e8db242' http://consul:8500/v1/kv/business-partner/service-client/client-secret &&
  curl -X PUT -d ${RABBITMQ_USER} http://consul:8500/v1/kv/business-partner/mq/user &&
  curl -X PUT -d ${RABBITMQ_PASS} http://consul:8500/v1/kv/business-partner/mq/password
}

putConsulData

while [ $? -ne 0 ]; do
    sleep 1
    echo "Could not connect to consul. Retrying..."
    putConsulData
done

