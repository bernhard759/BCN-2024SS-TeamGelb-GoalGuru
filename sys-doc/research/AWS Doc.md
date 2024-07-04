# AWS Documentation
## Account
Created an account for all team members

## Domain
Registered a domain for the web application: goalguruonline.com through the AWS Route 53 service. 

## SSL certificate
Requested a SSL certificate with DNS configuration as a validation method, through the AWS ACM service - the status currently is pending validation. 
The SSL certificate has been isssued succesfully. 

## Amazon ECR service 
A repository in the private registry has been successfully created. 
We are using git actions in order to automate the process of pushing a new docker image into the repository. 

## AWS App Runner service
Created a new service with a public endpoint for the incoming traffic. 
The exposed port is set to 8000.
Our ECR repository is set as a source, and the process of updating the service in AppRunner is automatic. 
The trigger is a new push in ECR. 
Our domain from Route 53 has been added as a custom domain and the DNS configurations are done. The website is online. 

## AWS IAM service
Registered a new IAM account.
To push the built image to AWS ECR, we supply the access key and access key ID of our AWS IAM user to GitHub secrets. With this approach, no credentials are visible in the Docker runtime as GitHub secrets are stored encrypted.

## AWS S3 service
Created a new S3 bucket for our app, which stores the csv files. 


## Possible future developments
* **<u>Develop further the usage of the AWS S3 service</u>**  
Move the frontend to a separate S3 bucket for optimized
content delivery. This would decouple the frontend from
the backend and thus favor the principle separation of
concerns.
* **<u>Integrate AWS CloudFront</u>**  
Implementing  AWS CloudFront for our web app will improve performance by reducing latency through global content caching and enhance security with integrated DDoS protection.

* **<u>Integrate AWS EKS</u>**  
EKS will allow us to easily scale our containerized application across multiple nodes, ensuring high availability and reliability as our user base grows. It will automate tasks such as patching, node provisioning, and updates, reducing the operational burden and allowing our team to focus on developing new features. By orchestrating our containers with Kubernetes, we can achieve better resource utilization through advanced scheduling and efficient bin-packing, ultimately reducing costs. 

* **<u>Integrate AWS Lambda</u>**    
AWS Lambda will enable us to run backend functions without provisioning or managing servers, automatically scaling our application in response to incoming requests.

* **<u>Integrate AWS EventBridge</u>**   
By using EventBridge, we can easily trigger Lambda functions based on events such as database changes, user actions, or system notifications. This integration allows us to decouple our application's components, making it easier to manage and update individual parts without affecting the whole system.

## Resources

* **AWS CloudFront Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

* **AWS EKS Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/eks/latest/userguide/what-is-eks.html)

* **AWS Lambda Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/lambda/latest/dg/welcome.html)

* **AWS EventBridge Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)

* **Amazon S3 Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/s3/index.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/s3/index.html)

* **Amazon ECR Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/AmazonECR/latest/userguide/what-is-ecr.html)

* **AWS IAM Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/IAM/latest/UserGuide/introduction.html)

* **AWS ACM Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/acm/latest/userguide/acm-overview.html)

* **AWS App Runner Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/apprunner/latest/dg/what-is-apprunner.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/apprunner/latest/dg/what-is-apprunner.html)

* **Amazon Route 53 Documentation**
  * [Documentation in English](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)
  * [Documentation in German](https://docs.aws.amazon.com/de_de/Route53/latest/DeveloperGuide/Welcome.html)




