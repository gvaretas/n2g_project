# IoT device app

This NodeJS script is used to connect and publish data to AWS IoT Core

## Getting Started

### How to install

1. Install NPM packages
   ```sh
   npm install
   ```
2. Setup .env file 
    ```JS
    DEVICE_KEYPATH='./<Cert_folder>/*.pem.key'
    DEVICE_CERTPATH='./<Cert_folder>/*.pem.crt'
    DEVICE_CAPATH='./<Cert_folder>/root.pem'
    DEVICE_CLIENT_ID='<Client ID>'
    HOST='<Your AWS host>'
   ```
3. Configure payload and topic for the device.


## Authors

Contributors names and contact info

[@Varetas Georgios](https://www.linkedin.com/in/georgios-varetas-b8b888211/)

## Version History

* 0.1
    * Initial Release

