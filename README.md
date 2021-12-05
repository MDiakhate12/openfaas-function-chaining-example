# Deploy two simple chained functions with OpenFaaS

> Prerequisite: Make sure to have faas-cli correctly installed on your GKE cluster <br>
> Prerequisite: Make sure to have Openfaas correctly installed on your GKE cluster with load balancer option <br>
> Prerequisite: Make sure be logged into your docker registry account from your command line <br>

## Check you openfaas gateway URL
Look for EXTERNAL-IP field of the "openfaas-external" service
```
kubectl get svc -n openfaas
```

Your output should be similar to this <br>
![multiplication](https://970-cs-835634686586-default.cs-europe-west1-iuzs.cloudshell.dev/files/download/?id=3b5ecc56-3ded-48e8-90c1-dace248ada42)
In following parts, replace all [YOUR OPENFAAS GATEWAY URL] or [YOUR OPENFAAS GATEWAY IP] with respectively your own gateway url or external ip
You should also use your own docker registry

## Clone the repo
```
git clone https://github.com/MDiakhate12/openfaas-function-chaining-example.git
cd openfaas-function-chaining-example/
```

## Set the Gateway URL environnement variable 
> Important: do this before creating a function with faas-cli
```
export OPENFAAS_URL="http://[YOUR OPENFAAS GATEWAY IP]:8080"
# eg: export OPENFAAS_URL="http://35.187.36.236:8080"
```

## Set the docker registry prefix
> Important: do this before creating a function with faas-cli
```
export OPENFAAS_PREFIX="[YOUR DOCKER REGISTRY URL]/[YOUR DOCKER REGISTRY USERRNAME]"
# eg: export OPENFAAS_PREFIX="docker.io/mdiakhate12"
```

## Pull the node10 express template
```
faas template pull https://github.com/openfaas-incubator/node10-express-service
```

## Deploy addition function
```
faas-cli up -f diaf-addition.yml
```

## Deploy multiplication function
```
faas-cli up -f diaf-square.yml 
```

## Invoke the addition function
> Note: This will invoke autmatically the multiplication function since it's chained
```
curl \
 -XPOST \
 -H "Content-type: application/json" \
 -d \
 '{
     "a": 10,
     "b": 20
 }' \
 $OPENFAAS_URL/function/diaf-addition \
```

# Side note: If you want to create your own functions from node10 express template

## Pull the node10 express template
```
faas template pull https://github.com/openfaas-incubator/node10-express-service
```

## Create your function from template
```
faas-cli new [YOUR FUNCTION NAME] --lang node10-express-service
```

## Add this minimal script to get started into [YOUR FUNCTION NAME]/handler.js
```js
"use strict"
const bodyParser = require('body-parser')

module.exports = async (config) => {
    const app = config.app;

    app.use(bodyParser.json());

    app.get('/', (req, res) => {

        const result = req.body

        res.send({ result });
    });
}
```

## Deploy your function
```
faas-cli up [YOUR FUNCTION NAME].yml
```


```
curl \
 -XPOST \
 -H "Content-type: application/json" \
 -d \
 '{
     "a": 10,
     "b": 20
 }' \
 $OPENFAAS_URL/function/[YOUR FUNCTION NAME] \
```