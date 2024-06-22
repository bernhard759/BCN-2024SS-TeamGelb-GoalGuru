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

## Possible future developments
* Add CloudFront 
* Add Kubernetes for better scalability 




