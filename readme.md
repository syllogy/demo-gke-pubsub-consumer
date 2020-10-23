# GKE nodejs consumer for a GCP pub/sub message

This project is an example of a consumer / worker that receives Cloud Pub/SUB messages, and can act on them.

It deploys to a GKE cluster


## Prerequisites  
- GKE Cluster (ensure the node pool has Cloud Pub/Sub enabled under security)    
- Cloud PUB/SUB topic  
- gcr.io repository  
- service account running GKE nodes will need pub/sub permissions (Pub/Sub Publisher && Pub/Sub Subscriber)>  A good practice is to create a separate service account to run these workloads with only the permissions needed to run the GKE nodes, access pub/sub and to log messages and metrics. [Instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#use_least_privilege_sa)
- nodejs 14.7.0 for local development  
- docker for local build  
- kubectl for deploying

## How to build and run locally
ensure node 14.7.0 or later is installed  

setup a gcp service account and credential json file (instructions: https://cloud.google.com/docs/authentication/getting-started)  

```
git clone https://github.com/doitintl/demo-gke-pubsub-consumer.git  
```

modify the package.json file debug script and change the following environment vars:  
- GOOGLE_APPLICATION_CREDENTIALS  (json creds downloaded for the server account step above) 
- GCP_PROJECT  (your project)  
- PUBSUB_SUBSCRIPTION (just add a new name for this, the process will create it if it is not there)  
- PUBSUB_TOPIC (can create in GCP console)   

Once the above environment vars are set, run the following:

```
npm i  
npm run debug
```

To exit, press CTRL+C  

# How to Deploy to GKE

## 1. build docker

```
# login
gcloud auth login  
gcloud auth configure-docker  

# add your GCP project id to the gcr.io repository URL in following 
docker build . -t us.gcr.io/<your-project>/gke-pubsub-consumer:latest
docker push us.gcr.io/<your-project>/gke-pubsub-consumer:latest
```
example  
```
docker build . -t us.gcr.io/andy-playground-264516/gke-pubsub-consumer:latest  
docker push us.gcr.io/andy-playground-264516/gke-pubsub-consumer:latest  
```

## 2. deploy to GKE
modify the ./kubernetes/deployment.yaml env vars for 
- GCP_PROJECT  (your project)  
- PUBSUB_SUBSCRIPTION (just add a new name for this, the process will create it if it is not there)  
- PUBSUB_TOPIC (can create in GCP console)   

modify the IMAGE var to match the gcr.io URL above for the container

connect to your cluster   
example:  
```
gcloud container clusters get-credentials cluster-pubsub-consumer --zone us-central1-c --project andy-playground-264516

# deploy to GKE  
kubectl apply -f ./kubernetes/deployment.yaml

# verify pod is running
kubectl get pods
```
## 3. verify the consumer is working
Add some single messages into the PUB/SUB topic on the GCP console and then look at the pod logs   

example:

```
kubectl get pods

# NAME                                        READY   STATUS    RESTARTS   AGE
# demo-gke-pubsub-consumer-589c75fdb9-r8478   1/1     Running   0          3m4s

# get logs for consumer pod
kubectl logs demo-gke-pubsub-consumer-589c75fdb9-r8478

> consumer-demo@1.0.0 start /app  
> node server.js  
project: andy-playground-264516  subscription: demo-producer-subxx  topic: demo-producer  
initListeners started...  
getSubscription started...  
running http listening on port 8080  
initListeners finished  
messageHandler start  
Message: {'foo':'bar'}  
messageHandler end  
messageHandler start  
Message: {'foo':'bar2'}  
messageHandler end  
```

