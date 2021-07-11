const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');



exports.handler =  async function(event, context, callback) {

    const poolData = {
        UserPoolId : process.env.COGNITO_USER_POOL_ID, // Your user pool id here
        ClientId : process.env.COGNITO_CLIENT_ID // Your client id here
    };
    const pool_region = process.env.AWS_REGION;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const AccountId = process.env.AWS_ACCOUNT_ID;
    const ApiId = process.env.API_ID;

    let result = {}
    console.log(event);
    var token = event.headers.authorization;

    try{
        result = await ValidateToken(token);
    }catch (error){
        result = error;
    }
    console.log(result);
    const method = event.requestContext.http.method;
    const arn = 'arn:aws:execute-api:'+ pool_region +':'+ AccountId +':' + ApiId + '/$default/'  + method + '/clients/' + result.id;
    console.log(arn);
    switch (result.code) {
        case 200:
            callback(null, generatePolicy('user', 'Allow', arn));
            break;
        default:
            callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}


async function ValidateToken(token) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://cognito-idp.eu-west-1.amazonaws.com/'+ userPoolId +'/.well-known/jwks.json',
            json: true
        }, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                await jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        // console.log("Invalid Token.");
                        reject( {
                            "code": 400,
                            "msg": err.message
                        })
                    } else {
                        // console.log("Valid Token.");
                        console.log(payload);
                        resolve( {
                            "id": payload['custom:clientID'],
                            "code": 200,
                            // "msg": error
                        });
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        })
    });
}

