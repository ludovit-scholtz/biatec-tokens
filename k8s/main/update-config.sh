kubectl apply -f deployment-fe.yaml -n biatec-tokens
kubectl delete configmap biatec-tokens-fe-main-conf -n biatec-tokens
kubectl create configmap biatec-tokens-fe-main-conf --from-file=conf-fe -n biatec-tokens
kubectl rollout restart deployment/biatec-tokens-fe-app-deployment -n biatec-tokens
kubectl rollout status deployment/biatec-tokens-fe-app-deployment -n biatec-tokens