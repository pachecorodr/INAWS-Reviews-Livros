ECR_REGISTRY="992382503552.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 992382503552.dkr.ecr.us-east-1.amazonaws.com
docker build -t reviewlivros/frontend .
docker tag reviewlivros/frontend:latest $ECR_REGISTRY/reviewlivros/frontend:latest
docker push $ECR_REGISTRY/reviewlivros/frontend:latest