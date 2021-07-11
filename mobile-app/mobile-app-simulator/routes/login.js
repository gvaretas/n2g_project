const express = require('express');
const router = express.Router();

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

async function Login(email, password) {
  const authenticationDetails = await new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });
  const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID, // Your user pool id here
    ClientId: process.env.COGNITO_APP_CLIENT_ID // Your client id here
  };
  const pool_region = process.env.COGNITO_REGION; //Your region here
  const userPool = await new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const userData = {
    Username: email,
    Pool: userPool
  };
  const cognitoUser = await new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise(function (resolve, reject) {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result){
        // console.log(result);
        resolve(result);
      },
      onFailure: function(err){
        // console.log(err);
        reject(err);
      },
    })
  });
}

/* GET users listing. */
router.get('/',async function(req, res, next) {
  let result = {};
  const { email, password } = req.body;
  try{
    result = await Login(email, password);
  }catch (error) {
    console.log(error)
    result = {
      "code": 500,
      "msg": error.message
    }
    res.status(result.code).json(result.msg);
    return
  }
  console.log(result);
  // console.log('hello');
  // console.log(result);
  res.status(200).json(
      {
        "idToken": result.idToken.jwtToken,
        "accessToken": result.accessToken.jwtToken
      });
});

module.exports = router;
