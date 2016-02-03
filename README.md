# BoozeBot API
Node server for an API used by BoozeBot.

## Deploying
* In order to deploy, you will need to be granted permission from @kenzshelley.
  This will require that you set up an OpenShift account, and then email
  kenzshelley@gmail.com requesting permission.
* After you have permissions, you must add a new remote to your git config for
  this repo: 
  ```  
  url = ssh://56874b262d5271956d00015e@boozebot-boozebotapi.rhcloud.com/~/git/boozebot.git/
  fetch = +refs/heads/*:refs/remotes/origin/*
  ```
* Finally, pushing to this remote will automatically trigger a deploy: 
  ```
    git push deploy head:master
  ```

## Notes
* Server is currently hosted using OpenShift -- it doesn't like es6 style js. 
* If you have read permissions on OpenShift, you can ssh into the production machine at 56874b262d5271956d00015e@boozebot-boozebotapi.rhcloud.com.
