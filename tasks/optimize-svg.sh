#!/usr/bin/env bash
shopt -s nullglob

function optimize_file {
  echo "Optimizing SVG file - $1"
  ./node_modules/.bin/svgo --config=./.svgo.yml --pretty --quiet -i "$1"
}

function optimize_dir {
  # get all files in given directory ...
  for f in $1/*.svg
  do
    optimize_file "$f"
  done

  # ... and all subdirectories
  for f in $1/**/*.svg
  do
    optimize_file "$f"
  done
}

optimize_dir "./front/common/public/symbols"
optimize_dir "./front/main/app/symbols"
