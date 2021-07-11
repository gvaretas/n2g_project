const express = require('express');
const router = express.Router();

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

async function RegisterUser(userPool, email, password, name, gender, id){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:name}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:gender}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:clientID",Value: id}));

    // console.log(attributeList);

    return new Promise((resolve, reject) => {
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                reject( {
                    "code": 400,
                    "msg": err.message
                } )
            }else{
                resolve(
                {
                    "code": 201,
                    "msg": "Success"
                }
                )
            }
            // cognitoUser = result.user;
            // resolve(cognitoUser)
        })});
}

router.get('/', async (req, res, next) => {

    let result = {};

    const poolData = {
        UserPoolId : process.env.COGNITO_USER_POOL_ID, // Your user pool id here
        ClientId : process.env.COGNITO_APP_CLIENT_ID // Your client id here
    };

    // console.log(poolData);

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const { email, password, name, gender, id} = req.body;
    try{
        result = await RegisterUser(userPool, email, password, name, gender, id);
    } catch (error) {
        console.log(error)
        result = {
            "code": error.code,
            "msg": error.msg
        }
    }

    res.status(result.code).json(result.msg);
    // res.status(result.code).json(result.msg);
})

module.exports = router
