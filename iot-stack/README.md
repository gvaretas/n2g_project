# IoT Stack

This stack creates AWS resources in order to handle real time data from IoT Devices.

## Description

This .yaml file can be used to create a Data Analytics Stack in AWS. In general, it creates two S3 buckets, uses AWS IoT Core service to capture real time data and creates an SQS Queue in order to send the data for further processing. 

Regarding the real time data, AWS IoT Core is connected with remote devices. After capturing it, an IoT Rule is responsible for driving it to an AWS S3 Data Lakes. The format of the S3 keys is {clientID}/{YYYYMMDD}/{timestamp}.json .

The second bucket stores consumption files which are uploaded by supplier. Once a file for a specific installation is uploaded to the bucket, an event sends the S3 metadata to an SQS queue. 


## Getting Started

### Architecture

![AWS Architecture](https://github.com/gvaretas/n2g_project/blob/master/iot-stack/IoT-Diagram.PNG?raw=true)

### Parameters

* ProjectName 
* IotTopicName
* IotBucketName

### Installing

* This template creates the IoT thing. Still the administrator is responsible for setting up the policies as well as providing the certificates to IoT Devices. 

* In iot-device-app folder, there is a script written in nodejs which connects the iot-device with the AWS IoT Core Service and publish real time data. 

## Authors

Contributors names and contact info

[@Varetas Georgios](https://www.linkedin.com/in/georgios-varetas-b8b888211/)

## Version History

* 0.1
    * Initial Release

