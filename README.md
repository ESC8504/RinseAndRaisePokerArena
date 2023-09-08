# Setup:

1. git checkout main

   git pull origin

   (make regular updates to keep local copy up to date).
  (After that you can also merge the changes from your local main branch into the feature branch:
  git checkout feature/xxx to make sure or switch to the feature branch
  git merge main  this will merge the changes from the local main branch into the currently checked-out feature branch.)

3. git checkout -b feature/XXX
to create a "feature" branch to keep it away from the main branch, which keeps the work isolated and organized.

4. Coding, update, commit

5. git push -u origin feature/XXX

This pushes new-feature to the central repo, and the -u flag adds it as a remote tracking branch. After setting up the tracking branch, git push can be invoked without any parameters to automatically push the new-feature branch to the central repository.

# Request a new branch and pull request :
1. git checkout -b eric-feature main

This checks out a branch called eric-feature based on main, and the -b flag tells Git to create the branch if it doesn’t already exist.

2. coding, commit, update

3. git push -u origin eric-feature

This pushes eric-feature to the central repository (origin), and the -u flag adds it as a remote tracking branch.

4. Create a Pull Request

5. git checkout main

   git pull

   git pull origin eric-feature

   git push

If the team member wanted, they could pull eric-feature into their local repository and work on it on his own. Any commits he added would also show up in the pull request.
This process will results in a merge commit. Once the team member is ready to accept the pull request, they needs to merge the feature into the stable project (this can be done by any one on the team)

   They can also do:

   git fetch origin

   git checkout eric-feature

6. ***Review and Merge: Before every merge, at least one group member other than the one who made the pull request should review the pull request, possibly requesting changes. Once approved, the changes can be merged into the main branch of the organization repository.
