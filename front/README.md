# Public folder
This is the place to store all client side assets

## locales
Place for all translation files

Folder structure:
```
  locales
    [language]
  	  filename.json
```

## scripts
Place for all client side files

Folder structure:
```
  scripts
    [packageName]
  	  all files
```

that is compiled to

```
  scripts
    packageName.js
```

## styles
Place for all styles

Folder structure:
```
  styles
  	  all files
  	  app.scss
  	  baseline.scss
  	  _settings.scss
  	  vendor/
  	  and so on
```

that is compiled to

```
  styles
    app.css
    baseline.css
```

all files that begin with '_' are ignored
so to add new package just add filename.scss

vendor folder should not be edited manually
This is where bower installs third party scss

## svg
Place for all svg icons and graphics

```
  svg
    [packageName]
      all svg files
```

That is compiled to

```
  svg
    packageName.svg
```

## templates
Place for all template files

```
  templates
    [packageName]
      all template files
```

That is compiled to

```
  templates
    packageName.js
```
## vendor
Those are third party files
Should not be touched manually
place that bower installs all files
