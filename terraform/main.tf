terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = "us-east-1"
}


resource "aws_default_vpc" "default" {
}

resource "aws_instance" "backend_servers" {
  ami = "ami-08982f1c5bf93d976"
  key_name = "default-ec2"
  instance_type = "t3.micro"
  vpc_security_group_ids = [aws_security_group.backend_servers_sg.id]

  count = 1
  tags = {
    Name = "Backend_Server_${count.index + 1}"
    environment = "dev"
  }
}

resource "local_file" "frontend_env" {
  filename = "${path.module}/../client/static/js/config/config.js"
  content  = <<EOT
export const API_URL = "http://${aws_instance.backend_servers[0].public_ip}"
EOT
}