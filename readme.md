# Project ADGE-Ph2 

[![N|Solid](https://www.tamm.abudhabi/-/media/Project/TAMM/Home/TPN---Home/logo.svg)](https://www.tamm.abudhabi)

This is the DLS components project that serve all AbuDhabi government entities.

Before you start working on this project you should have knowledge on the following : 

* [Javascript](https://www.javascript.com/) - No need to talk about it xD 
* [jQuery](https://jquery.com/) - jQuery is a fast, small, and feature-rich JavaScript library
* [Bootstrap](https://getbootstrap.com/docs/4.3) - the world’s most popular framework for building responsive, mobile-first sites
* [SASS/LESS](https://sass-lang.com/) - Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.
* [Git](https://git-scm.com/) - Git version control
* [Gulp](https://gulpjs.com/) - A toolkit to automate & enhance your workflow


# How to use

This documentation is to elaborate how to use the project compile, deploy and even run the local server/storybook.

## Project Dependencies

You need to make sure that you have the following versions to run the project. 

* Git : v2.24.3
* NPM : v6.13.4
* Node : v10.18.1 
* Gulp : v3.9.1
* Gulp CLI : v2.2.0

---

The following steps explaining how to download and start development processes. 

## Download

Use [GIT](https://git-scm.com/downloads) to clone and download the latest version of the project source code. 

```bash
git clone <repo URL>
```

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install the project dependencies .

```bash
cd < Project Folder >
npm install 
```


## Usage

ADGE-Ph2 project contains 3 main parts : 
* Extensions folder
  - Contains all extension themes for each component we have under our DLS. 
* Themes folder
  - Contains DefaultSite theme as a reference or quick usage as a base template. 
* Shared utilities folder 
  - contains mixins, functions, media queries, shared variables and palette template for the ADGE site. 



To work on any of the extensions or develop new one, please follow the below command lines to setup: 

> To **create** new **extension** or **theme** run any of the following command: 

```bash 
gulp create --path <ex-example || THEME> 

gulp create --p <ex-example || THEME> 

## if you don not have gulp as a global package you can use npm to do the same 

npm run gulp create -- --p <ex-example || THEME> 
```

> To **run the development server** for any of the extension theme use the below : 
 
```bash 
gulp --path <ex-example> 

gulp --p <ex-example> 

## if you don not have gulp as a global package you can use npm to do the same 

npm run gulp -- --p <ex-example || THEME> 
```
> To **run the storybook for all components we have use the below : 
 
```bash 
npm run storybook  
```


> To **compile** the SASS files for any **extension** or **theme** use the below : 
 
```bash 
gulp compile --path <ex-example || THEME> 

gulp compile --p <ex-example || THEME> 

## if you don not have gulp as a global package you can use npm to do the same 

npm run gulp compile -- --p <ex-example || THEME> 

```

> To **compile** and move any **extension** inside any specific **theme** you need to provide the destination param like the below : 
 
```bash 
gulp compile --path <ex-example> --dest  <THEME>

gulp compile --p <ex-example> --dest <THEME>

## if you don not have gulp as a global package you can use npm to do the same 

npm run gulp compile -- --p <ex-example> --dest <THEME>

```

> To **compile all** the **extensions** under specific **theme** use the below : 
 
```bash 
gulp compile --path <ex-example || THEME> --all

gulp compile --p <ex-example || THEME> --all 

## if you don not have gulp as a global package you can use npm to do the same 

npm run gulp compile -- --p <ex-example || THEME> --all 

```
_NB: to remove any extension or all extensions under any site you can use the above commands with **"decompile"**_

> To **deploy** the any of the **extensions** or **themes** to sitecore CMS make sure you are following the below steps:

- You need to configure your **_branding.scss** file with your palette colors. 
- Add your proper extensions needed for this theme
- Compile your theme to get the minified version of css & js code. 
- run one of the below commands to deploy the whole theme as per as your needs 
 
```bash 
##Each of the below commands will show a prompt command line input to insert your credentials. 
gulp deploy --p <THEME> ##This will deploy the whole theme with everything to dev2 server.

## to deploy to specific environment use the --env param as below : 
gulp deploy --p <THEME> --env <dev01||dev02||stg||qa> 

## to deploy to specific files instead of the whole folder your can use the below 
gulp deploy --p <THEME> --files <folder || filepath> 
## You can add multiple folders or files comma separated ex. "folder1,folder2,folder3/file.ext,folder4/file2.ext"

## To get rid of the prompt window for better experience you can use --username and --password params
gulp deploy --p <THEME> --files <folder> --username <un> --password <pwd> --env <key>

```

## Work Plan

For fixing bug in any of the extension themes or any new feature, you need to pull the **development** branch and follow the below naming convention to create a new branch to start development process : 

```sh 
<Base Branch Name> - <type of branch (bugfix || feature || enhancement)> - <Message> 
ex. "development-bugfix-fixingBreadCrumbOnMobile" 
ex. "development-feature-newFloatingBreadCrumb"
ex. "development-enhancement-FloatingBreadCrumbOption"
```

Regarding the **commits** please follow the below naming convention and make sure your are splitting your code into single commits for each extension themes: 

```sh 
<Ext || Theme> - <Extension Name || Theme Name > - <Message> 
ex. "Ext - Footer - fixing accordion panel on desktop" 
ex. "Theme - DefaultSite - Compiling new footer changes"
```

In case of adding any bugfix,feature or enhancement to any of the extension theme we will create a **merge request** to the **development** branch and cherry-pick your commit to your target branch : 

```bash 
git checkout <your-branch> 
git cherry-pick <commit SHA> 
```