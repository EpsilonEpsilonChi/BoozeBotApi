# BoozeBot API
Node server for an API used by BoozeBot.

## Routes
POST /queue_drink {user: "user_name", drink: "drink_name"}
* Adds the specified drink to BoozeBot's drink queue for the specified user.  
* Adds the drink transaction to the user's transaction list.
* Checks that the recipe exists, that all ingredients in the recipe have enough
  remaining for the recipe, and that the user exists.

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

## SSH
ssh 56874b262d5271956d00015e@boozebot-boozebotapi.rhcloud.com
** requires you have been granted permission on OpenShift

## Notes
* Server is currently hosted using OpenShift -- it doesn't like es6 style js. 
