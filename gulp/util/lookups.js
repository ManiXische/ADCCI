export default {
    compilationType : {
        theme : 0,
        extension: 1
    },
    includes : ['styles' , 'scripts',  'images' , 'fonts'],
    excludes : ['styles/extentions' , 'scripts/extentions'],
    constants : {
        extConstant : "###ext###", 
        projectNameConstant : '###projectName###', 
        tenantConstant : '###tenant###',
        versionConstant : '###ver###',
        ownerConstant : '###owner###',
        extensionPrefix : 'ex-',
        extensionsFolder : 'extensions',
        themesFolder : 'themes'
    }

}