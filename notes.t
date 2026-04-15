When you are handling cors on the aws lambda side, you could deactivate the CORS in the
function config tab.

npm run build
git add --all .
git commit -m ""
git push origin master

aws s3 sync ./dist s3://perezlab.co --delete

If you want to delete files in S3 that no longer exist locally:


aws cloudfront create-invalidation --distribution-id ETZ7PNGO0XIVD --paths "/*"
