SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"
docker buildx build --platform linux/amd64  -t dockerhub.codyer.cloud/codyer_cn/chatfx-be:0.0.1 --push -f ./Dockerfile .
cd "$PROJECT_ROOT"

echo "重新部署 ChatFX 后端 服务..."
kubectl config use-context cn
kubectl delete -f "$PROJECT_ROOT/publish/chatfx_be_service.yaml"
kubectl apply -f "$PROJECT_ROOT/publish/chatfx_be_service.yaml"
