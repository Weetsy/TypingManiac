# import the json utility package since we will be working with a JSON object
import json
# import the AWS SDK (for Python the package name is boto3)
import boto3
# import two packages to help us with dates and date formatting
from time import gmtime, strftime
import random, string
from boto3.dynamodb.conditions import Key

# create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# use the DynamoDB object to select our table
table = dynamodb.Table('TypingManiac')
# store the current time in a human readable format in a variable
now = strftime("%D:%H:%M:%S", gmtime())

# define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
# extract values from the event object we got from the Lambda service and store in a variable
    user = event['User']
    speed = event['WPM']
    accuracy = event['Accuracy']
    scan_kwargs = {
        'FilterExpression': Key('User').begins_with(user)
    }

    done = False
    start_key = None
    while not done:
        if start_key:
            scan_kwargs['ExclusiveStartKey'] = start_key
        response = table.scan(**scan_kwargs)
        start_key = response.get('LastEvaluatedKey', None)
        done = start_key is None
    version = 0
    for i in response['Items']:
        curVer = i['Version']
        highest = max(curVer, version)
        version = highest
    version += 1
# write name and time to the DynamoDB table using the object we instantiated and save response in a variable
    response = table.put_item(
        Item={
            'User': user + "<" + str(version) + ">",
            'WPM':speed,
            'Accuracy': accuracy,
            "Time": now,
            "Version": version
            })
# return a properly formatted JSON object
    return {
        'statusCode': 200,
        'body': json.dumps(user + " had speed " + str(speed) + " and accuracy " + str(accuracy) + " on " + now),
    }

