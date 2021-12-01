# import the json utility package since we will be working with a JSON object
import json
# import the AWS SDK (for Python the package name is boto3)
import boto3
# import two packages to help us with dates and date formatting
from time import gmtime, strftime
from boto3.dynamodb.conditions import Key
# create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# use the DynamoDB object to select our table
table = dynamodb.Table('TypingManiac')

# define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
    """
    return {
        'statusCode': 200,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": json.dumps(event)
    }
    """
# extract values from the event object we got from the Lambda service and store in a variable
    user = event['queryStringParameters']['user']
# write name and time to the DynamoDB table using the object we instantiated and save response in a variable
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
    # Parse records in useful format / filter wrong user ones too
    cleanItems = {'Items': []}
    for i in response['Items']:
        version = i['User'].removeprefix(user) # Version data
        curUser = i['User'].removesuffix(version) # User data
        if curUser != user:
            continue
        wpm = i['WPM']
        accuracy = i['Accuracy']
        time = i['Time']
        cleanItems['Items'].append({
            'User': curUser, 'WPM': int(wpm),
            'Accuracy': int(accuracy), 'Time': time, 'Version': version[1:-1] })
# Return records
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        "body": json.dumps(cleanItems)
    }
