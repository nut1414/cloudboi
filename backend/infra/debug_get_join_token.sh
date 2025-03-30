# Get node hostname
NODE_HOSTNAME=$(hostname)
NODE_IP=$(hostname -I | awk '{print $1}')

# Get join token from backend
JSON_BODY=$(curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "{\"server_name\": \"$NODE_HOSTNAME\"}" \
        http://10.10.10.2:8000/internal/cluster/create_token)
echo "JSON_BODY: $JSON_BODY"

JOIN_TOKEN=$(echo $JSON_BODY | jq -r '.join_token')
echo "JOIN_TOKEN: $JOIN_TOKEN"