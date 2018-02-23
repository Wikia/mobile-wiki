vignette-js
===========

Client-side interface for interacting with [Vignette](https://github.com/Wikia/vignette)

## Usage

To get a Vignette thumbnail path for an image, use the `getThumbURL` method.

### getThumbURL(url, options)

The **url** parameter is a URL to an image. The **options** parameter is a hash of options for the thumbnail. Available options are:

 * mode
 * width
 * height
 * xOffset1\*
 * xOffset2\*
 * yOffset1\*
 * yOffset2\*

\* These options are only used for the *window-crop* and *window-crop-fixed* modes. See below.

#### *options*

The **mode** option is one of Vignette's thumbnail modes. See [Vignette's documentation](https://github.com/wikia/vignette#thumbnail-modes) for more information and visual depictions of each mode. Thumbnail modes may (should) be referenced from the `Vignette.mode` object:

```
Vignette.mode.fixedAspectRatio
Vignette.mode.fixedAspectRatioDown
Vignette.mode.scaleToWidth
...
Vignette.mode.zoomCropDown
```

The **width** and **height** options are pixel values, and should be numbers -- not strings.

The **xOffset1**, **xOffset2**, **yOffset1**, **yOffset2** options are pixel values for the *window-crop* and *window-crop-fixed* modes. The first offset is subtracted from the second to get the *window-width* and *window-height* parameters for the Vignette API.

A few examples of valid options:

```
{
  mode: Vignette.mode.zoomCrop,
  width: 250,
  height: 250
}
```

```
{
  mode: Vignette.mode.scaleToWidth,
  width: 80
}
```

```
{
  mode: Vignette.mode.windowCrop,
  width: 100,
  height: 100,
  xOffset1: 10,
  yOffset1: 10,
  xOffset2: 90,
  yOffset2: 90
}
```

## Issues

If you find a bug in this library or see that it's not currently up-to-spec with [Vignette core](https://github.com/wikia/vignette), please open a new Github issue in this repository.
 