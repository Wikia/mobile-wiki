#!/usr/bin/env bash
shopt -s nullglob

function optimize_file {
  echo "Optimizing SVG file - $1"
  ./node_modules/.bin/svgo --config=./.svgo.yml --pretty --quiet -i "$1"
}

function optimize_dir {
  # get all files in given directory ...
  for file in $1/*.svg
  do
    optimize_file "$file"
  done

  # ... and all subdirectories
  for file in $1/**/*.svg
  do
    optimize_file "$file"
  done
}


# if you created new SVG directory outside of this list, please add it here and to README.md
optimize_dir "./app/symbols"
