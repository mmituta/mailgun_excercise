# Mailgun event record

This project defines a lambda function that is responsible for processing the Mailgun webhook events.

## Compilation
The project defines a script that compiles the typescript code to a JS lambda, and creates a zip file that's ready to be deployed to AWS.
To compile and package the lambda run:

`npm install`

`npm run package`

The project provides a set of unit tests that can be run using `npm run test` command.

## Deployment
The project includes a terraform configuration that:
* Creates and deploys the lambda
* Creates and configures API gateway trigger
* Creates a SNS topic
* Creates a DynamoDB table
* Configures all necessary permissions

To deploy the function use `terraform apply` from the `infrastructure` directory. 

You will be prompted to provide:
* AWS account id
* AWS region
* Mailgun HTTP webhook signing key (to validate that the request comes from Mailgun)

The terraform allso expects the following environmental variables to be present
(replace the `{}` placeholders with your values):

`export AWS_ACCESS_KEY_ID={access key}`

`export AWS_SECRET_ACCESS_KEY={secret access key}`

`export DEFAULT_REGION={default region}`

## Lambda
To deploy the lambda manually, without the use of terraform. The following configuration needs to be present (terraform creates it automatically):
### Environmental variables:
* `AWS_ACCOUNT_ID`
* `MAILGUN_SIGN_KEY`

### DynamoDB
Table called `MailgunEvents` with Partition key `id (S)` and Sort key `timestamp (N)`

### SnS
Topic with name `mail_events_topic`