variable "default_tags" {
  type = map(string)
  default = {
    repository  = "https://github.com/maji-KY/fl-ac-appsync"
    application = "fl-ac-appsync"
  }
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-1a", "ap-northeast-1c", "ap-northeast-1d"]
}
