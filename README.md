**Edit a file, create a new file, and clone from Bitbucket in under 2 minutes**

When you're done, you can delete the content in this README and update the file with details for others getting started with your repository.

_We recommend that you open this README in another tab as you perform the tasks below. You can [watch our video](https://youtu.be/0ocf7u76WSo) for a full demo of all the steps in this tutorial. Open the video in a new tab to avoid leaving Bitbucket._

---

## Edit a file

You’ll start by editing this README file to learn how to edit a file in Bitbucket.

1. Click **Source** on the left side.
2. Click the README.md link from the list of files.
3. Click the **Edit** button.
4. Delete the following text: _Delete this line to make a change to the README from Bitbucket._
5. After making your change, click **Commit** and then **Commit** again in the dialog. The commit page will open and you’ll see the change you just made.
6. Go back to the **Source** page.

---

## Create a file

Next, you’ll add a new file to this repository.

1. Click the **New file** button at the top of the **Source** page.
2. Give the file a filename of **contributors.txt**.
3. Enter your name in the empty file space.
4. Click **Commit** and then **Commit** again in the dialog.
5. Go back to the **Source** page.

Before you move on, go ahead and explore the repository. You've already seen the **Source** page, but check out the **Commits**, **Branches**, and **Settings** pages.

---

## Clone a repository

Use these steps to clone from SourceTree, our client for using the repository command-line free. Cloning allows you to work on your files locally. If you don't yet have SourceTree, [download and install first](https://www.sourcetreeapp.com/). If you prefer to clone from the command line, see [Clone a repository](https://confluence.atlassian.com/x/4whODQ).

1. You’ll see the clone button under the **Source** heading. Click that button.
2. Now click **Check out in SourceTree**. You may need to create a SourceTree account or log in.
3. When you see the **Clone New** dialog in SourceTree, update the destination path and name if you’d like to and then click **Clone**.
4. Open the directory you just created to see your repository’s files.

Now that you're more familiar with your Bitbucket repository, go ahead and add a new file locally. You can [push your change back to Bitbucket with SourceTree](https://confluence.atlassian.com/x/iqyBMg), or you can [add, commit,](https://confluence.atlassian.com/x/8QhODQ) and [push from the command line](https://confluence.atlassian.com/x/NQ0zDQ).

---

## Docker

**mahindra-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/mahindra_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9080:8080 -p 9443:8443 -v /tmp/mahindra_admin/logs/:/usr/local/tomcat/logs/ --name mahindra_admin loyalie/mahindra_admin-<profile>:<version>
- To push a docker image: docker push loyalie/mahindra_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/mahindra_admin-<profile>:<version>

**brigade-admin deployment instruction**

This project now has docker support:

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/winnre_brigade_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9081:8080 -p 9444:8443 -v /tmp/winnre_brigade_admin/logs/:/usr/local/tomcat/logs/ --name winnre_brigade_admin loyalie/winnre_brigade_admin-<profile>:<version>
- To push a docker image: docker push loyalie/winnre_brigade_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/winnre_brigade_admin-<profile>:<version>

**lnt-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/winnre_lnt_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9082:8080 -p 9445:8443 -v /tmp/winnre_lnt_admin/logs/:/usr/local/tomcat/logs/ --name winnre_lnt_admin loyalie/winnre_lnt_admin-<profile>:<version>
- To push a docker image: docker push loyalie/winnre_lnt_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/winnre_lnt_admin-<profile>:<version>

**spre-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/spre_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9083:8080 -p 9446:8443 -v /tmp/spre_admin/logs/:/usr/local/tomcat/logs/ --name spre_admin loyalie/spre_admin-<profile>:<version>
- To push a docker image: docker push loyalie/spre_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/spre_admin-<profile>:<version>

**century-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/century_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9084:8080 -p 9447:8443 -v /tmp/century_admin/logs/:/usr/local/tomcat/logs/ --name century_admin loyalie/century_admin-<profile>:<version>
- To push a docker image: docker push loyalie/century_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/century_admin-<profile>:<version>

**srijan-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/srijan_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9086:8080 -p 9449:8443 -v /tmp/srijan_admin/logs/:/usr/local/tomcat/logs/ --name srijan_admin loyalie/srijan_admin-<profile>:<version>
- To push a docker image: docker push loyalie/srijan_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/srijan_admin-<profile>:<version>

**rohan-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/rohan_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9087:8080 -p 9450:8443 -v /tmp/rohan_admin/logs/:/usr/local/tomcat/logs/ --name rohan_admin loyalie/rohan_admin-<profile>:<version>
- To push a docker image: docker push loyalie/rohan_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/rohan_admin-<profile>:<version>

**winnre-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/winnre_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 9089:8080 -p 9451:8443 -v /tmp/winnre_admin/logs/:/usr/local/tomcat/logs/ --name winnre_admin loyalie/winnre_admin-<profile>:<version>
- To push a docker image: docker push loyalie/winnre_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/winnre_admin-<profile>:<version>

**arvind-admin deployment instruction**

- To build a docker image: docker build -f docker/Dockerfile -t loyalie/arvind_admin-<profile>:<version> .
- To deploy a docker image: docker run -d -p 4070:8080 -p 9460:8443 -v /tmp/arvind_admin/logs/:/usr/local/tomcat/logs/ --name arvind_admin loyalie/arvind_admin-<profile>:<version>
- To push a docker image: docker push loyalie/arvind_admin-<profile>:<version>
- To pull a docker image: docker pull loyalie/arvind_admin-<profile>:<version>
