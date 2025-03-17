# curl 'https://api.sec-api.io/' \
#   -H 'accept: application/json, text/plain, */*' \
#   -H 'accept-language: en-GB,en;q=0.7' \
#   -H 'content-type: application/json;charset=UTF-8' \
#   -H 'origin: https://sec-api.io' \
#   -H 'priority: u=1, i' \
#   -H 'referer: https://sec-api.io/' \
#   -H 'sec-ch-ua: "Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"' \
#   -H 'sec-ch-ua-mobile: ?0' \
#   -H 'sec-ch-ua-platform: "macOS"' \
#   -H 'sec-fetch-dest: empty' \
#   -H 'sec-fetch-mode: cors' \
#   -H 'sec-fetch-site: same-site' \
#   -H 'sec-gpc: 1' \
#   -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36' \
#   --data-raw '{"query":"companyName:\"PayPal Holdings Inc\"","from":"0","size":"200","sort":[{"filedAt":{"order":"desc"}}]}'