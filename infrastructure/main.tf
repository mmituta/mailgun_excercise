terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

variable "aws_account_id" {
  type = string
  sensitive = true
  default = "212858567084"
}
variable "aws_region" {
  type = string
  default = "us-east-1"
}
provider "aws" {
  profile = "default"
  region  = "${var.aws_region}"
}




resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "mail_lambda" {
  # If the file is not in the current working directory you will need to include a 
  # path.module in the filename.
  filename      = "../dist/lambda.zip"
  function_name = "mail_events"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../dist/lambda.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      AWS_ACCOUNT_ID = "${var.aws_account_id}"
    }
  }

   depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_iam_role_policy_attachment.lambda_storage,
    aws_iam_role_policy_attachment.lambda_sns_publish
  ]
}



# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name = "message_api"
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "status"
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.mail_lambda.invoke_arn
}

#
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mail_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.api.id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.resource.path}"
}

resource "aws_api_gateway_deployment" "v1" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.resource.id,
      aws_api_gateway_method.method.id,
      aws_api_gateway_integration.integration.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "v1" {
  deployment_id = aws_api_gateway_deployment.v1.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "v1"
}

resource "aws_sns_topic" "mail_events" {
  name = "mail_events_topic"
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${var.aws_region}:${var.aws_account_id}:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_storage_write" {
  name        = "lambda_storage_write"
  path        = "/"
  description = "IAM policy for accessing a storage from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/MailgunEvents",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_sns_publish" {
  name        = "lambda_sns_publish"
  path        = "/"
  description = "IAM policy for publish to a SNS topic from a lambda"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sns:Publish"
      ],
      "Resource": "arn:aws:sns:${var.aws_region}:${var.aws_account_id}:${aws_sns_topic.mail_events.name}",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}
resource "aws_iam_role_policy_attachment" "lambda_storage" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_storage_write.arn
}

resource "aws_iam_role_policy_attachment" "lambda_sns_publish" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_sns_publish.arn
}
resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "MailgunEvents"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"
  range_key      = "timestamp"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}
