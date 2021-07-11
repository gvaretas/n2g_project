# AWS stack to serve mobile app requests

This stack creates AWS resources in order to handle requests derived from mobile app users. 

## Description

This .yaml file can be used to create a Serverless Stack in AWS. In general, it sets up an AWS Cognito User Pool for authentication/authorization, an API Gateway for serving mobile calls, two lambda functions and a DynamoDB Table to store User profile data.  

AWS Cognito user pool is used to register the mobile user and provide appropriate tokens in order to authenticate their API calls.
API Gateway receives the REST calls and invokes lambda authorizer. The latter checks the user token as to authenticate and also authorizes the API Gateway by providing an IAM Policy. 


## Getting Started

### Parameters

* Project 

* S3Bucket


### Installing

* This file creates the serverless resourses in AWS. 

* The S3 bucket defined in Parameter Section stores the .zip files for the lambdas.

* The key of the lambda authorizer should be authorizer.zip

* The key of the lambda function should be function.zip

### Manual Steps

* Create Cognito App Client without an App client secret as it is not supported in javascript.

* Custom attributes for Cognito User Pool can not be created as the regular attributes. Thus, custom attribute as 'custom:clientID' should be added.

* COGNITO_CLIENT_ID , COGNITO_USER_POOL_ID environmental variables should be set to the configuration tab of the lambda authorizer.

### Architecture


## Authors

Contributors names and contact info

[@Varetas Georgios](https://www.linkedin.com/in/georgios-varetas-b8b888211/)

## Version History

* 0.1
    * Initial Release

